// electron/main.ts
import Setting from "@electron/model/settings";
import { ipcMain } from "electron";

// If your Electron runtime doesn't have global fetch (Node <18), uncomment:
// import fetch from "node-fetch";

type Role = "system" | "user" | "assistant" | "tool";

type ChatMessage = {
    role: Role;
    content?: string;
    name?: string;
    tool_call_id?: string;
    // allow provider-specific fields (e.g. DeepSeek reasoning)
    [k: string]: any;
};

type ToolCall =
    | { id: string; type: "run_command"; args: { command?: string } }
    | { id: string; type: "done" };

ipcMain.handle(
    "llm:chat",
    async (
        _evt,
        payload: {
            messages: ChatMessage[];
        }
    ) => {
        const { messages } = payload ?? {};
        if (!Array.isArray(messages)) {
            throw new Error("Invalid payload: messages must be an array.");
        }

        const apiKey = (await Setting.findOne({ key: "deepseek" }))?.value;
        if (!apiKey) throw new Error("DeepSeek API key not provided.");

        const base = "https://api.deepseek.com/v1";
        const model = "deepseek-reasoner";

        // NOTE: tools schema matches your frontend
        const tools = [
            {
                type: "function",
                function: {
                    name: "run_command",
                    description:
                        "Run a shell command on the target server over SSH and return stdout/stderr and exit code.",
                    parameters: {
                        type: "object",
                        properties: {
                            command: {
                                type: "string",
                                description: "Exact shell command to run",
                            },
                        },
                        required: ["command"],
                        additionalProperties: false,
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "done",
                    description: "Task is finished.",
                    parameters: { type: "object", properties: {} },
                },
            },
        ] as const;

        const body = {
            model,
            messages, // forward exactly as received (including tool_call_id/name if present)
            temperature: 0.2,
            tool_choice: "auto",
            tools,
            // Keep responses textual; DeepSeek Reasoner may include reasoning fields in `message`
            response_format: { type: "text" as const },
        };

        const res = await fetch(`${base}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            let detail = "";
            try {
                detail = await res.text();
            } catch {
                /* ignore */
            }
            throw new Error(`DeepSeek error ${res.status}: ${detail || res.statusText}`);
        }

        const data: any = await res.json();
        const choice = data?.choices?.[0];
        const assistantMsg: ChatMessage | undefined = choice?.message;

        // Parse tool calls for renderer convenience (keep provider IDs!)
        const toolCalls: ToolCall[] =
            assistantMsg?.tool_calls
                ?.map((tc: any) => {
                    const fn = tc?.function;
                    const id = tc?.id;
                    if (!fn?.name || !id) return null;

                    if (fn.name === "run_command") {
                        let args: any = {};
                        try {
                            args = fn.arguments ? JSON.parse(fn.arguments) : {};
                        } catch {
                            // leave args empty if JSON parse fails
                            args = {};
                        }
                        return { id, type: "run_command", args: { command: args?.command } } as ToolCall;
                    }

                    if (fn.name === "done") {
                        return { id, type: "done" } as ToolCall;
                    }

                    return null;
                })
                .filter(Boolean) || [];

        return {
            assistantRaw: assistantMsg, // full raw assistant message (incl. tool_calls, reasoning fields)
            toolCalls,                  // simplified calls for your renderer loop
        };
    }
);
