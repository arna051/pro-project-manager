import { v4 } from "uuid";
import * as pty from "node-pty";

export function createShell(): [string, pty.IPty] {
    const name = v4()
    const shell = pty.spawn(process.platform === "win32" ? "cmd.exe" : "bash", [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: {
            ...process.env,
            TERM: 'xterm-256color',   // important for ncurses apps
            COLORTERM: 'truecolor'
        }
    });
    return [name, shell]
}