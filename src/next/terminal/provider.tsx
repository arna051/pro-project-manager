"use client";

import { useState } from "react";
import { Terminal } from "./type";
import { toast } from "sonner";
import { terminalContext } from "./context";
import TerminalTabs from "./components/terminals-tab";

const Provider = terminalContext.Provider

export default function TerminalProvider({ children }: ChildProp) {
    const [terminals, setTerminals] = useState<Terminal[]>([]);

    const [overall, setOverall] = useState({ tab: -1, count: -1 })

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

    function send(id: string, cmd: string) {
        window.electron.terminal.write(id, cmd);
        setOverall({ tab: terminals.length, count: overall.count + 1 })
    }

    return <Provider
        value={{ create, terminals, send }}
    >
        {
            children
        }
        <TerminalTabs
            terminals={terminals}
            create={create}
            close={close}
            over={overall}
        />
    </Provider>
}