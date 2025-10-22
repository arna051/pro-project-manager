import { Client } from 'ssh2';

export interface SSHConfig {
    host: string;
    port?: number;
    username: string;
    password?: string;
    timeoutMs?: number;
}

export function runRemoteCommandWithSudo(
    cfg: SSHConfig,
    command: string,
): Promise<string> {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const timeoutMs = cfg.timeoutMs ?? 120000;
        let resolved = false;
        const cleanup = () => {
            try { conn.end(); } catch { }
        };
        const timeout = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                cleanup();
                reject(new Error(`SSH command timed out after ${timeoutMs}ms`));
            }
        }, timeoutMs);

        conn.on('ready', () => {
            // Request a PTY if using sudo (some sudo configs require a tty)

            conn.exec(command, { pty: true }, (err: any, stream: any) => {
                if (err) {
                    clearTimeout(timeout);
                    cleanup();
                    return reject(err);
                }

                let stdout = '';
                let stderr = '';

                stream.on('close', (code: any, signal: any) => {
                    clearTimeout(timeout);
                    cleanup();
                    if (resolved) return;
                    resolved = true;
                    if (code === 0) resolve(stdout.trim());

                    else reject(new Error(`Command failed (code=${code}): ${stderr.trim() || stdout.trim()}`));
                });

                stream.on('data', (data: Buffer) => {
                    const s = data.toString();

                    if (new RegExp('password for ', 'i').test(s)) {
                        stream.write(`${cfg.password}\n`, console.log)
                    }

                    stdout += s;
                });

                stream.stderr.on('data', (data: Buffer) => {
                    stderr += data.toString();
                });

            });
        }).on('error', (err: any) => {
            clearTimeout(timeout);
            cleanup();
            if (!resolved) {
                resolved = true;
                reject(new Error(`SSH connection error: ${err.message}`));
            }
        }).connect({
            host: cfg.host,
            port: cfg.port ?? 22,
            username: cfg.username,
            password: cfg.password,
            readyTimeout: timeoutMs,
        });
    });
}
