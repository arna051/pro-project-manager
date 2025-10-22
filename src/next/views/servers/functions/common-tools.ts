import { IServer } from "@electron/model/server";
import type { AddToolProps } from "easy-llm-call";
import { actions } from "../actions";
type Props = {
    autoExecute: boolean
    servers: IServer[]
    register: (name: string, opt: Omit<AddToolProps, "name">) => any
}

export function registerCommonTools({ autoExecute, register, servers }: Props) {
    async function runOnLocal({ command }: Record<string, string>) {
        if (!autoExecute) {
            const accepted = await window.electron.dialog.confirm(`Are you sure you want to run "${command}" on local machine?`);
            if (!accepted) return "User refused to run this command on the machine!"
        }
        const str = await window.electron.terminal.execute(command)
        return str
    }
    async function runOnServer({ serverId, command }: Record<string, string>) {
        if (!autoExecute) {
            const accepted = await window.electron.dialog.confirm(`Are you sure you want to run "${command}" on remote machine?`);
            if (!accepted) return "User refused to run this command on the machine!"
        }

        const server = servers.find(x => x._id.toString() === serverId);

        if (!server) return "serverId was not found in listed servers"

        const str = await window.electron.ssh.run({
            host: server.host,
            username: server.user,
            port: Number(server.port),
            password: server.password,
            timeoutMs: 1e3 * 60
        }, command)
        return str
    }

    register(actions.execute_on_local.name, {
        desc: "execute a command on local machine then return result as string",
        func: runOnLocal,
        props: {
            command: {
                desc: "the command you want to run on local machine",
                required: true,
                type: 'string'
            }
        }
    })
    register(actions.execute_on_remote.name, {
        desc: "execute a command on a target remote machine then return result as string",
        func: runOnServer,
        props: {
            command: {
                desc: "the command you want to run on the remote machine you want",
                required: true,
                type: 'string'
            },
            serverId: {
                desc: "the target remote machine id you want to run command on",
                required: true,
                type: "string"
            }
        }
    });


}