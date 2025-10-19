import { createShell } from "./components/shell";
import { ipcMain } from "electron";
import * as pty from "node-pty";
import createBashFile from "./components/bash-file";
import execute, { copyFiles } from "./components/execute";
import { getGitData } from "./components/git";
import kill from "tree-kill";


export class TerminalKeeper {
    terminals: Record<string, pty.IPty> = {};

    constructor() {
        ipcMain.on("command-input", (_, id, input: string) => {

            const shell = this.terminals[id]
            if (shell) {
                shell.write(input);
            }
        });

        ipcMain.handle("execute", async (_, script: string, args: string[]) => {
            return await execute(script, args)
        })
        ipcMain.on("copy-files", (_, source: string, dest: string, ignore: string[]) => {
            copyFiles(source, dest, ignore)
        })

        ipcMain.handle("git", async (_, path: string) => {
            return await getGitData(path)
        })

        ipcMain.on("terminal:resize", (_, id: string, cols: number, rows: number) => {
            const shell = this.terminals[id]
            shell.resize(cols, rows);
        });

        ipcMain.handle("create-shell", event => {
            return this.add(event)
        })
        ipcMain.handle("remove-shell", async (_, id) => {
            return await this.remove(id)
        })
        ipcMain.handle("get-bash-file", (_, content: string) => {
            return createBashFile(content);
        })
    }

    add(event: Electron.IpcMainInvokeEvent) {
        const [id, shell] = createShell();
        this.terminals[id] = shell;


        shell.onData(e => {
            event.sender.send("command-output", id, e);
        })


        shell.onExit(() => {
            event.sender.send("command-output", id, `\n[Process exited]`);
            this.remove(id)
        })

        return id;
    }

    async remove(id: string): Promise<void> {
        const shell = this.terminals[id];
        if (!shell) return;

        await new Promise<void>((resolve, reject) => {
            kill(shell.pid, "SIGKILL", (err) => {
                if (err) {
                    console.error(`Failed to kill process ${shell.pid}:`, err);
                    return reject(err);
                }
                resolve();
            });
        });

        delete this.terminals[id];
    }
}