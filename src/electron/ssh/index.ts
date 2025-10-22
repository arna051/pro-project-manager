import { ipcMain } from "electron"
import { runRemoteCommandWithSudo, SSHConfig } from "./components/execute"

ipcMain.handle("ssh:execute", async (_,
    cfg: SSHConfig,
    command: string,) => {
    return await runRemoteCommandWithSudo(cfg, command)
})