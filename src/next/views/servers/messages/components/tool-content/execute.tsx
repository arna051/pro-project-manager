import { IServer } from "@electron/model/server";
import { ToolShowProps } from "./type";
import CodeBlock from "@next/components/code";

export function ToolExecute({ args, failed, resolved, servers, result }: ToolShowProps & { servers: IServer[] }) {

    const server = servers.find(x => x._id.toString() === args.serverId)
    const terminal = server ? `${server.user}@${server.host}` : 'you@localhost'
    return <CodeBlock
        language="bash"
        children={`${terminal}:~$ ${args.command}\n\n=== result ===\n${resolved ? (failed ? "Error" : result || "Done") : ""}`}
    />
}