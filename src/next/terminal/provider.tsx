"use client";

import { useState } from "react";
import { Terminal } from "./type";
import { toast } from "sonner";
import { terminalContext } from "./context";
import TerminalTabs from "./components/terminals-tab";

const Provider = terminalContext.Provider

export default function TerminalProvider({ children }: ChildProp) {
    const [terminals, setTerminals] = useState<Terminal[]>([]);

    async function create(name: string, initialCommand?: string): Promise<string | null> {
        try {
            const id = await window.electron.terminal.create();

            setTerminals(x => [...x, { id, name, initialCommand }])

            return id
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "failed to create a terminal");
            return null
        }
    };

    async function close(id: string) {
        try {
            await window.electron.terminal.close(id)

            setTerminals(x => {
                const t = [...x];
                return t.filter(c => c.id !== id)
            })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "failed to create a terminal");
            return null
        }
    };

    return <Provider
        value={{ create }}
    >
        {
            children
        }
        <TerminalTabs
            terminals={terminals}
            create={create}
            close={close}
        />
    </Provider>
}