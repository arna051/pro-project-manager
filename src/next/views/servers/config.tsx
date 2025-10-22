// app/(wherever)/SSHConfig.tsx
"use client";

import {
    Box, Grid, Stack,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { IServer } from "@electron/model/server";
import { ServerAnimation } from "./components/fake-commands";
import { ConfigSidebar } from "./components/config-sidebar";
import { Composer } from "./components/composer";
import { ConfigBar } from "./components/config-bar";
import { Errors } from "./components/erros";
import { AIBackground, AILoading, Banners } from "./components/helpers";
import { useAI } from "./hooks/useAI";
import { registerCommonTools } from "./functions/common-tools";
import { Messages } from "./messages";
import { entity_fetch_tools } from "./functions/get-entities";
import { time_tools } from "./functions/time";
import { save_tools } from "./functions/save";
import { repo_tools } from "./functions/repo";
import { open_tools, useTerminalTool } from "./functions/open";


export default function SSHConfig({ apiKey, servers, dashboard }: { apiKey?: string, servers: IServer[], dashboard?: boolean }) {

    const {
        autoExecute,
        errors,
        failedTasks,
        llm,
        messages,
        loading,
        send,
        setAutoExecute
    } = useAI({
        servers,
        apiKey,
        dashboard,
    })


    useTerminalTool(llm.registerTool)

    registerCommonTools({
        autoExecute,
        register: llm.registerTool,
        servers
    });


    [
        ...entity_fetch_tools,
        ...time_tools,
        ...save_tools,
        ...repo_tools,
        ...open_tools
    ].forEach(x => {
        llm.registerTool(x.name, x)
    })

    useEffect(() => {
        const x = document.getElementById("chat-contents")
        if (!x) return;
        x.scrollTo({ top: x.scrollHeight })
    }, [messages.length])


    return (
        <>
            <AIBackground />
            <Box sx={{ p: 2, pt: 6, position: "relative", height: "100%", maxHeight: "100vh" }}>
                <Grid container sx={{ height: "100%", maxHeight: "100%" }} spacing={2}>
                    <Grid size={{ xs: 8 }} sx={{ height: "100%", maxHeight: "100%", position: "relative" }}>
                        <Box sx={{ height: "100%", maxHeight: "100%", p: 2, overflowY: "auto", pr: 3, }} component="div" id="chat-contents">
                            <Stack gap={1} sx={{ pb: 24, pt: 12 }}>
                                <Banners
                                    apiKey={apiKey}
                                    dashboard={dashboard}
                                    messages={messages}
                                />

                                <Messages
                                    messages={messages}
                                    servers={servers}
                                    failedTasks={failedTasks}
                                />

                                <AILoading
                                    loading={loading}
                                    messages={messages}
                                />

                                <Errors {...errors} />
                            </Stack>
                        </Box>

                        <ConfigBar
                            autoExecute={autoExecute}
                            setAutoExecute={setAutoExecute}
                            dashboard={!!dashboard}
                        />
                        {/* Composer */}
                        <Composer
                            abort={llm.abort}
                            apiKey={apiKey}
                            loading={loading}
                            send={send}
                        />
                    </Grid>

                    {/* Terminal side */}
                    <Grid size={{ xs: 4 }} sx={{ height: "100%", maxHeight: "100%", position: "relative", overflowY: 'auto' }}>
                        <Stack gap={2}>
                            <ServerAnimation servers={servers} />
                            <ConfigSidebar
                                loading={loading}
                                messages={messages}
                                servers={servers}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
