import { exec } from "child_process";
import os from "os";
import path from "path";

export default function execute(script: string, args: string[] = []): Promise<string> {
    return new Promise((res, rej) => {
        const cli = exec(script.concat(" ", args.join(" ")), (err, stdout, stderr) => {
            clearTimeout(timeout)
            cli.kill();
            if (err) return res(err.message)
            if (stderr.trim()) return res(stderr)
            res(stdout);
        })
        const timeout = setTimeout(() => {
            cli.kill();
            res("Error: process time out!")
        }, 1e3 * 60);
    })
}


export async function copyFiles(
    source: string,
    dest: string,
    ignore: string[] = []
): Promise<void> {
    return new Promise((resolve, reject) => {
        const platform = os.platform();

        let cmd: string;

        if (platform === "win32") {
            // PowerShell version
            const ignorePatterns = ignore.map((n) => `-not ( $_.Name -eq '${n}' )`).join(" -and ");
            cmd = `powershell -Command "Get-ChildItem -Path '${path.resolve(source)}' | Where-Object { ${ignorePatterns || "$true"} } | Copy-Item -Destination '${path.resolve(dest)}' -Recurse -Force"`;
        } else {
            // Unix version with cp + find
            const excludeArgs = ignore.map((name) => `! -name '${name}'`).join(" ");
            cmd = `cp -r $(find ${path.resolve(source)} -mindepth 1 -maxdepth 1 ${excludeArgs}) ${path.resolve(dest)}/`;
        }

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Error copying files: ${stderr || error.message}`));
            }
            resolve();
        });
    });
}
