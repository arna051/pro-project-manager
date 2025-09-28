import { v4 } from "uuid";
import * as pty from "node-pty";

export function createShell(): [string, pty.IPty] {
    const name = v4()
    const shell = pty.spawn(process.platform === "win32" ? "cmd.exe" : "bash", [], {
        name,
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env as any
    });
    return [name, shell]
}