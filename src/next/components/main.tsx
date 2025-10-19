"use client";

import { useTerminal } from "@next/terminal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


let lock = false;
export default function IPCMainListener() {
    const router = useRouter();
    const { create, terminals } = useTerminal();

    useEffect(window.electron.onMessage(d => {
        if (lock) return;
        lock = true;
        if ("path" in d)
            router.push(d.path);
        if ("server" in d)
            create(`SSH ${d.server}`, `ssh ${d.server}`)
        if ("terminal" in d)
            create("Bash")
        setTimeout(() => {
            lock = false
        }, 1e3);
    }), [create, terminals])

    return null;
}