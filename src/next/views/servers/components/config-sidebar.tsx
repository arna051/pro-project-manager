"use client";

import {
    Box,
    Stack,
    Typography,
    Chip,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from "@mui/material";
import React, { useMemo } from "react";
import { ShinyText } from "@next/components/react-bits/shiny";
import CodeBlock from "@next/components/code";
import { ConfigIcon, TerminalIcon, TodoIcon } from "@next/components/icons";
import { Icon, StatusIcon } from "./icons";
import { IServer } from "@electron/model/server";
import { actions } from "../actions";
import ProjectServer from "@next/views/projects/components/servers";

type Props = {
    messages: any[],
    loading: boolean
    servers: IServer[]
}
export function ConfigSidebar({ loading, messages, servers }: Props) {
    return <>
        {
            useMemo(() => <Card className="glassy">
                <CardContent>
                    <Stack justifyContent="center" direction="row" gap={2}>
                        <StatusIcon size={122} messages={messages} loading={loading} />
                        <Stack flex="1 1 auto" gap={1}>
                            <ShinyText
                                text={loading ? "Working..." : "Standby"}
                                speed={2}
                            />
                            {
                                messages
                                    .filter(x => !!x.tool_calls)
                                    .slice(messages.length - 5, messages.length - 1)
                                    .map((x, i) => <Stack direction="row" gap={.5} alignItems="center" key={i}>
                                        <TerminalIcon width={16} height={16} />
                                        <Typography fontSize={11}>
                                            execute on: {x.tool_calls?.map((c: any) => {
                                                const server = servers.find(v => v._id.toString() === (c.function.arguments as any).serverId);
                                                if (!server) return "localhost";
                                                return server.title
                                            }).join(", ")}
                                        </Typography>
                                    </Stack>)
                            }
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>, [messages.length, loading])
        }

        <ProjectServer servers={servers} />
        {
            useMemo(() => <Card className="glassy">
                <CardHeader
                    title="Functions"
                    subheader="Methods available to assistant"
                    avatar={<ConfigIcon />}
                    action={
                        <Chip variant="outlined" color="warning" size="small" label={messages.filter(x => !!x.tool_calls).length} />
                    }
                />
                <CardContent>
                    <List dense>
                        <ListItem secondaryAction={
                            <Chip variant="outlined" size="small" label={messages.filter(x => !!x.tool_calls?.some((X: any) => X.function.name === actions.execute_on_local.name)).length} />
                        }>
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>
                            <ListItemText
                                primary={actions.execute_on_local.label}
                                secondary={actions.execute_on_local.desc}
                            />
                        </ListItem>
                        <ListItem secondaryAction={
                            <Chip variant="outlined" size="small" label={messages.filter(x => !!x.tool_calls?.some((X: any) => X.function.name === actions.execute_on_remote.name)).length} />
                        }>
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>
                            <ListItemText
                                primary={actions.execute_on_remote.label}
                                secondary={actions.execute_on_remote.desc}
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>, [messages.length])
        }
        {
            useMemo(() => <Box>
                <Stack direction="row" alignItems="center" gap={2}>
                    <TodoIcon />
                    <Typography variant="h6">Actions summary</Typography>
                    <Divider sx={{ flex: '1 1 auto' }} />
                </Stack>
                <Stack gap={2} sx={{ my: 2 }}>
                    {
                        messages
                            .filter(x => !!x.tool_calls)
                            .map((m, i) =>
                                m.tool_calls
                                    ?.filter((x: any) => x.function.name === actions.execute_on_local.name || x.function.name === actions.execute_on_remote.name)
                                    .map((t: any) => {
                                        const args: any = t.function.arguments
                                        const server = servers.find(v => v._id.toString() === args.serverId);

                                        const serverName = server?.title || "localhost";

                                        const functionName = (actions as any)[t.function.name].label;

                                        const result = messages.find(x => x.tool_call_id === t.id)
                                        return <Card className="glassy" key={t.id}>
                                            <CardHeader
                                                title={functionName}
                                                subheader={serverName}
                                                avatar={<TerminalIcon />}
                                            />
                                            <CardContent>
                                                <CodeBlock
                                                    language="bash"
                                                    children={`${server?.user || "user"}@${server?.host || "localhost"}:~$ ${args.command} \n\n${result?.content || "=== no results ==="}`}
                                                />
                                            </CardContent>
                                        </Card>
                                    }))
                    }
                </Stack>
            </Box>, [messages.length])
        }
    </>
}