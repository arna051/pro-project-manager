"use client";

import { useEffect, useMemo } from "react";
import { IServer } from "@electron/model/server";
import { ChatCompletionMessage, OllamaChatMessage, WithTime } from "easy-llm-call";
import UserMessage from "./components/user";
import ToolCallMessage from "./components/tool";
import AssistantMessage from "./components/assistant";
import { Stack, Typography } from "@mui/material";



type Props = {
    messages: WithTime<OllamaChatMessage>[] | WithTime<ChatCompletionMessage>[]
    servers: IServer[]
    failedTasks: string[]
}
export function Messages({ messages, servers, failedTasks }: Props) {


    useEffect(() => {
        const x = document.getElementById("chat-contents")
        if (!x) return;
        x.scrollTo({ top: x.scrollHeight })
    }, [messages.length]);

    return useMemo(() => messages.map((m, i) => {

        const key = i.toString();

        const {
            content,
            role,
            reasoning_content,
            tool_calls } = m


        if (tool_calls)
            return <ToolCallMessage
                key={key}
                content={content || ""}
                tool_calls={tool_calls}
                messages={messages}
                servers={servers}
                failedTasks={failedTasks}
            />;

        if (role === 'assistant')
            return <AssistantMessage
                content={content || ""}
                reasoning_content={reasoning_content || ""}
                key={key}
            />

        if (role === 'user')
            return <UserMessage
                key={key}
                content={content || "-"}
            />

        return null

    }), [messages.length])
}