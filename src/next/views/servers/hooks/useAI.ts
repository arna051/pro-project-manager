import { IServer } from "@electron/model/server";
import { SYSTEM_FULL_PROMPT } from "@next/constants/ai";
import { SYSTEM_PROMPT } from "@next/constants/config-server";
import { useEasyLLM, useEasyOllama } from "easy-llm-call/react";
import type { AddToolProps } from "easy-llm-call";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    apiKey?: string
    dashboard?: boolean
    servers: IServer[]
    tools?: AddToolProps[]
}
export function useAI({ servers, apiKey, dashboard, tools }: Props) {

    const LLM = useEasyLLM({
        apiKey,
        systemPrompt: (dashboard ? SYSTEM_FULL_PROMPT : SYSTEM_PROMPT).replace("__SERVERS__", JSON.stringify(servers)),
        tools
    })


    const Ollama = useEasyOllama({
        systemPrompt: (dashboard ? SYSTEM_FULL_PROMPT : SYSTEM_PROMPT).replace("__SERVERS__", JSON.stringify(servers)),
        tools
    })



    const [autoExecute, setAutoExecute] = useState(true);

    const [failedTasks, setFailedTasks] = useState<string[]>([]);


    const selected = apiKey ? LLM : Ollama

    const returnObject = {
        ...selected,
        ollama: undefined,
        llm: apiKey ? LLM.llm : Ollama.ollama,
        autoExecute,
        setAutoExecute,
        failedTasks
    }


    useEffect(() => {
        returnObject.llm.onToolError((id, name) => {
            setFailedTasks(l => [...l, id])
            toast.error(`action was ran to error - ${name}`)
        })
    }, [])


    return returnObject
}