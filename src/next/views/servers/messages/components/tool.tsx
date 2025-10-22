"use client";

import {
    Box,
    Typography,
    Stack,
    Collapse,
    Badge,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import CodeBlock from "@next/components/code";
import { LLMToolCall, OllamaToolCall } from "easy-llm-call";
import React, { useCallback, useState } from "react";
import { ChatCompletionMessage, OllamaChatMessage, WithTime } from "easy-llm-call";
import { actions } from "../../actions";
import { IServer } from "@electron/model/server";
import { ShinyText } from "@next/components/react-bits/shiny";
import { ToolExecute } from "./tool-content/execute";

type Props = {
    content: string
    tool_calls: OllamaToolCall[] | LLMToolCall[]
    messages: WithTime<OllamaChatMessage>[] | WithTime<ChatCompletionMessage>[]
    servers: IServer[]
    failedTasks: string[]
}
export default function ToolCallMessage({ content, tool_calls, messages, failedTasks, servers }: Props) {

    const [show, setShow] = useState(false);

    const group = useCallback(() => {
        const group: ({ failed: number, results: number, function: string })[] = [];

        tool_calls.forEach(c => {
            const result = messages.find(x => x.tool_call_id === c.id);
            const isFailed = !!failedTasks.find(x => x === c.id)
            const i = group.findIndex(x => x.function === c.function.name)
            if (i > -1) {
                if (isFailed)
                    group[i].failed++
                if (result)
                    group[i].results++
            } else {
                group.push({ function: c.function.name, failed: isFailed ? 1 : 0, results: result ? 1 : 0 })
            }
        })
        return group
    }, [messages.length, failedTasks.length]);

    const items = group();

    const failed = items.reduce((t, c) => t + c.failed, 0);
    const done = items.reduce((t, c) => t + c.results, 0);

    const working = (failed + done) !== tool_calls.length
    return <>
        <Box sx={{
            '& a,p,li': {
                fontSize: 11
            },
            '& h1': {
                fontSize: 14
            },
            '& h2': {
                fontSize: 13
            },
            '& h3': {
                fontSize: 12
            },
            '& h4': {
                fontSize: 11
            },
            '& h5': {
                fontSize: 10
            },
            '& h6': {
                fontSize: 9
            },
            maxWidth: '80%',
            alignSelf: 'start',
            minWidth: 200,
            color: 'text.secondary',
        }}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </Box>

        {working && <Box sx={{ fontSize: 9 }}>
            <ShinyText text="Executing..." speed={1.5} />
        </Box>}
        <Stack direction="row" alignItems="center" gap={1} onClick={() => setShow(l => !l)} sx={{ cursor: 'pointer', color: 'text.secondary' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                <g fill="none">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                    <path fill="currentColor" d="M20 16.5a1.5 1.5 0 0 1 .145 2.993L20 19.5h-8a1.5 1.5 0 0 1-.144-2.993L12 16.5zM3.283 5.283A1.5 1.5 0 0 1 5.29 5.18l.114.103l5.657 5.657a1.5 1.5 0 0 1 .103 2.007l-.103.114l-5.657 5.657A1.5 1.5 0 0 1 3.18 16.71l.103-.114L7.879 12L3.283 7.404a1.5 1.5 0 0 1 0-2.121"></path>
                </g>
            </svg>
            <Typography fontSize={10}>
                {items.map(x => (actions as any)[x.function].label).join(", ")} ({tool_calls.length})
            </Typography>
            <Box sx={{ flex: '1 1 auto' }} />
            {working && <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path strokeDasharray="2 4" strokeDashoffset={6} d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9">
                        <animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0"></animate>
                    </path>
                    <path strokeDasharray={32} strokeDashoffset={32} d="M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.4s" values="32;0"></animate>
                    </path>
                    <path strokeDasharray={10} strokeDashoffset={10} d="M12 8v7.5">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0"></animate>
                    </path>
                    <path strokeDasharray={6} strokeDashoffset={6} d="M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0"></animate>
                    </path>
                </g>
            </svg>}
            <Badge color="error" badgeContent={failed} />
            <Badge color="success" badgeContent={done} />
        </Stack>
        <Collapse in={show} unmountOnExit>
            <Stack gap={1} sx={{ fontSize: 9 }}>
                {
                    tool_calls.map(c => {

                        const result = messages.find(x => x.tool_call_id === c.id);

                        const isFailed = !!failedTasks.find(x => x === c.id)

                        return <ToolContent
                            key={c.id}
                            failed={isFailed}
                            resolved={!!result}
                            result={result?.content as any}
                            servers={servers}
                            function={c.function}
                            id={c.id || ""}
                            type="function"
                        />
                    })
                }
            </Stack>
        </Collapse>
    </>
}


function ToolContent({ function: { name, arguments: args }, servers, failed, resolved, result }: LLMToolCall<Record<string, any>> & { servers: IServer[], failed: boolean, resolved: boolean, result?: string }) {


    const props = {
        args,
        failed,
        resolved,
        result
    }

    switch (name) {
        case actions.execute_on_local.name:
        case actions.execute_on_remote.name:
            return <ToolExecute
                servers={servers}
                {...props}
            />

        default: return <>Fucked</>
    }
}