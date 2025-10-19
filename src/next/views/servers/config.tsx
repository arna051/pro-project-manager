// app/(wherever)/SSHConfig.tsx
"use client";

import { IServer } from "@electron/model/server";
import {
    Box, Grid, IconButton, InputAdornment, InputBase, Stack,
    useTheme, Typography, Switch, FormControlLabel, Paper, CircularProgress,
    alpha,
    Collapse,
    Alert,
    AlertTitle
} from "@mui/material";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useEasyLLM, useEasyOllama } from "easy-llm-call/react"
import ReactMarkdown from "react-markdown";
import { OLLAMA_PROMPT } from "@next/constants/ollama";
import { ShinyText } from "@next/components/react-bits/shiny";
import CodeBlock from "@next/components/code";


let timeout: any = null;
let auto = true
let _proxy = false
export default function SSHConfig({ apiKey }: { apiKey?: string }) {
    const termRef = useRef<HTMLDivElement | null>(null);
    const theme = useTheme();
    const params = useSearchParams();
    const id = params.get("id");
    const password = params.get("password");
    const port = params.get("port");
    const host = params.get("host");
    const user = params.get("user");

    const { messages, loading, send, errors } = apiKey ? useEasyLLM({
        apiKey,
        systemPrompt: OLLAMA_PROMPT.replace(/SUDO_PASSWORD/g, password || ""),
        tools: [
            {
                name: 'run',
                desc: 'runs a command on the target server through command line by "ssh user@host "input command prop"" then it will return the results as string',
                func: runOnServer,
                props: {
                    command: {
                        desc: "the command that must be run on the target server",
                        required: true,
                        type: 'string'
                    }
                }
            }
        ]
    }) : useEasyOllama({
        systemPrompt: OLLAMA_PROMPT.replace(/SUDO_PASSWORD/g, password || ""),
        tools: [
            {
                name: 'run',
                desc: 'runs a command on the target server through command line by "ssh user@host "input command prop"" then it will return the results as string',
                func: runOnServer,
                props: {
                    command: {
                        desc: "the command that must be run on the target server",
                        required: true,
                        type: 'string'
                    }
                }
            }
        ]
    })

    const [server, setServer] = useState<IServer | null>(null);
    const [terminalId, setTerminalId] = useState<string>();
    const [mounted, setMounted] = useState(false);

    // ---- UI CHAT (rendered only) ----
    const [input, setInput] = useState("");
    const [autoExecute, setAutoExecute] = useState(auto);
    const [proxy, setProxy] = useState(_proxy);


    async function runOnServer({ command }: Record<string, string>) {
        if (!auto) {
            const accepted = await window.electron.dialog.confirm(`Are you sure you want to run "${command}" on machine?`);
            if (!accepted) return "User refused to run this command on the machine!"
        }
        const str = await window.electron.terminal.execute(`${_proxy ? "proxychains4 " : ""}ssh -p ${port} ${user}@${host} "${command}"`);
        return str
    }


    async function mount() {
        try {
            const id = await window.electron.terminal.create();
            setTerminalId(id);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "failed to create a terminal");
        }
    }

    function sendCommandToShell(cmd: string) {
        if (!terminalId) return;
        window.electron.terminal.write(terminalId, `${cmd}\n`);
    }

    // ---- data boot ----
    useEffect(() => {
        if (!id) return;
        window.electron.db
            .doc("Server", [{ $match: { _id: id } }])
            .then((res) => { if (res) setServer(res); })
            .catch((err) => toast.error(err instanceof Error ? err.message : "We have an error!"));
    }, [id]);

    useEffect(() => {
        auto = autoExecute;
        _proxy = proxy
    }, [autoExecute, proxy])

    useEffect(() => {
        if (mounted) return;
        setMounted(true);
        mount();
    }, [mounted]);

    // ---- terminal init ----
    useEffect(() => {
        if (!terminalId || !server) return;
        const term = new Terminal({
            fontFamily: "monospace",
            fontSize: 14,
            cursorBlink: true,
            allowTransparency: true,
            theme: {
                background: "#00000000",
                foreground: theme.palette.text.primary,
                selectionBackground: "#00000000",
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(termRef.current!);
        fitAddon.fit();

        const offData = window.electron.terminal.onData(terminalId, (data) => term.write(data));
        term.onData((input) => {
            window.electron.terminal.write(terminalId, input)
        });

        const fit = () => window.electron.terminal.resize(terminalId, term.cols, term.rows);
        fit();
        term.focus();

        clearTimeout(timeout)

        timeout = setTimeout(() => {
            sendCommandToShell(`ssh ${server.user}@${server.host} -p ${server.port}`);
        }, 1000);

        return () => {
            offData?.();
            term.dispose();
        };
    }, [terminalId, server, theme.palette.text.primary]);



    useEffect(() => {
        const x = document.getElementById("chat-contents")
        if (!x) return;
        x.scrollTo({ top: x.scrollHeight })
    }, [messages.length])


    return (
        <Box sx={{ p: 2, pt: 6, position: "relative", height: "100%", maxHeight: "100vh" }}>
            <Grid container sx={{ height: "100%", maxHeight: "100%" }}>

                {/* Chat side */}
                <Grid size={{ xs: 6 }} sx={{ height: "100%", maxHeight: "100%", position: "relative" }}>
                    <Box sx={{ height: "100%", maxHeight: "100%", p: 2, overflowY: "auto", pr: 3, }} component="div" id="chat-contents">
                        <Stack gap={2} sx={{ pb: 24, pt: 12 }}>
                            {!apiKey && <Alert severity="warning">
                                <AlertTitle>Enable Deepseek</AlertTitle>
                                for better performance and better answers from AI. please enable deepseek from settings.
                            </Alert>}

                            <Alert severity="info">
                                <AlertTitle>Caution</AlertTitle>
                                AI can fuck your server! use it with Caution.
                            </Alert>
                            {messages.filter(x => x.role !== 'system').map((m, i) => (
                                m.tool_calls || m.role === 'tool' ? <Box key={m.timestamp}
                                    sx={{
                                        p: 1,
                                        py: 0,
                                        mx: 1,
                                        borderLeft: '2px solid',
                                        borderColor: m.role === 'tool' ? 'primary.main' : 'secondary.main'
                                    }}>

                                    <Typography variant="caption" fontSize={10} sx={{ opacity: .7 }} color="text.secondary">{m.reasoning_content}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {
                                            m.role === 'tool' ? "Command result:" : "Run command:"
                                        }
                                    </Typography>
                                    {m.content && m.role === 'tool' && <CodeBlock
                                        language="bash"
                                        children={removeSudoPrompt(m.content) || "Done"}
                                    />}
                                    {m.content && m.role !== 'tool' && <Typography variant="caption" color="text.secondary">
                                        {
                                            m.content
                                        }
                                    </Typography>}
                                    {
                                        m.tool_calls?.length && <Stack gap={1}>
                                            {
                                                m.tool_calls?.map(c => <CodeBlock
                                                    key={c.id}
                                                    language="bash"
                                                    children={(c.function.arguments as any).command}
                                                />)
                                            }
                                        </Stack>
                                    }
                                </Box> :
                                    <Paper
                                        key={m.timestamp}
                                        sx={theme => ({
                                            p: 1.5,
                                            maxWidth: '80%',
                                            alignSelf: m.role === 'assistant' ? 'start' : 'end',
                                            minWidth: 200,
                                            backgroundColor: m.role === "assistant" ? theme.palette.common.black : theme.palette.background.default,
                                        })}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            {m.role === 'assistant' ? apiKey ? "Deepseek" : "llama3.1 Assistant" : "You"}
                                        </Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Typography variant="caption" fontSize={10} sx={{ opacity: .7 }} color="text.secondary">{m.reasoning_content}</Typography>

                                            <ReactMarkdown>{m.content}</ReactMarkdown>
                                        </Box>
                                    </Paper>
                            ))}
                            {loading && (
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "text.secondary" }}>
                                    <ShinyText
                                        text="Thinking..."
                                        speed={1}

                                    />
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={theme => ({
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            gap: 1,
                            backgroundColor: alpha(theme.palette.background.default, .6),
                            backdropFilter: 'blur(6px)'
                        })}>
                        <Typography variant="h6">{apiKey ? "Deepseek" : "llama3.1 Assistant"}</Typography>
                        <Stack gap={1}>
                            <FormControlLabel
                                control={<Switch size="small" checked={autoExecute} onChange={(e) => setAutoExecute(e.target.checked)} />}
                                label="Auto-execute"
                                slotProps={{
                                    typography: {
                                        variant: 'caption'
                                    }
                                }}
                            />
                            <FormControlLabel
                                control={<Switch size="small" checked={proxy} onChange={(e) => setProxy(e.target.checked)} />}
                                label="proxychains4"
                                slotProps={{
                                    typography: {
                                        variant: 'caption'
                                    }
                                }}
                            />
                        </Stack>
                    </Stack>
                    {/* Composer */}
                    <Stack direction="row" sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, gap: 1 }}>
                        <InputBase
                            sx={theme => ({
                                flex: "1 1 auto",
                                borderRadius: 2,
                                bgcolor: "background.paper",
                                p: 2,
                                backgroundColor: alpha(theme.palette.background.default, .6),
                                backdropFilter: 'blur(6px)'
                            })}
                            multiline
                            rows={4}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask AI to do something… (e.g., 'Install & start Nginx proxying port 3000')"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton title="Ask AI" disabled={loading}
                                        onClick={() => {
                                            send({
                                                message: {
                                                    role: 'user',
                                                    content: input
                                                },
                                                model: apiKey ? 'deepseek-reasoner' : 'llama3.1:8b'
                                            })
                                            setInput("")
                                        }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24">
                                            <g fill="none">
                                                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                                                <path fill="currentColor"
                                                    d="M20.235 5.686c.432-1.195-.726-2.353-1.921-1.92L3.709 9.048c-1.199.434-1.344 2.07-.241 2.709l4.662 2.699l4.163-4.163a1 1 0 0 1 1.414 1.414L9.544 15.87l2.7 4.662c.638 1.103 2.274.957 2.708-.241z" />
                                            </g>
                                        </svg>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Stack>
                </Grid>

                {/* Terminal side */}
                <Grid size={{ xs: 6 }}>
                    <Box ref={termRef} sx={{ width: "100%", height: "100%", overflow: "hidden" }} />
                </Grid>
            </Grid>
        </Box>
    );
}
function removeSudoPrompt(input: string) {
    if (typeof input !== 'string') return input;
    // Matches: [sudo] password for <anything-but-newline-or-colon>:
    // - case-insensitive
    // - allows extra spaces
    // - removes optional trailing newline
    const re = /\[sudo\]\s*password\s+for\s+[^:\r\n]+:\s*(?:\r?\n)?/gi;
    return input.replace(re, '');
}