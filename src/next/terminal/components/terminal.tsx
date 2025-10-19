import { useEffect, useRef, useState } from "react";
import type { Terminal as TType } from "../type";
import { Terminal } from "@xterm/xterm";
import { Box, useTheme } from "@mui/material";
import { FitAddon } from "@xterm/addon-fit";

let timeout: any = null;

export default function TerminalXterm({ terminal, close }: { terminal: TType, close: (id: string) => any }) {
    const termRef = useRef<HTMLDivElement | null>(null);
    const xtermRef = useRef<Terminal | null>(null); // keep a handle to the instance
    const theme = useTheme();
    const [initiated, setInitiated] = useState(false);

    useEffect(() => {
        const term = new Terminal({
            fontFamily: "monospace",
            fontSize: 14,
            cursorBlink: true,
            allowTransparency: true,
            theme: {
                background: "#00000000",
                foreground: theme.palette.text.primary,
                selectionBackground: "#00000010",
            },
        });
        xtermRef.current = term;

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(termRef.current!);
        fitAddon.fit();

        // ---- wire PTY <-> xterm ----
        window.electron.terminal.onData(terminal.id, (data) => {
            term.write(data);
            if (/\[Process exited\]/.test(data)) return close(terminal.id);
        });
        term.onData((input) => {
            window.electron.terminal.write(terminal.id, input);
        });

        // ---- COPY/PASTE ----
        // 1) Keyboard shortcuts (Ctrl/Cmd-C to copy selection, Ctrl/Cmd-V to paste)
        term.attachCustomKeyEventHandler((ev) => {
            const isMac = navigator.platform.toLowerCase().includes("mac");
            const ctrlOrCmd = isMac ? ev.metaKey : ev.ctrlKey;
            const key = ev.key.toLowerCase();

            // Copy selection
            if (ctrlOrCmd && key === "c") {
                if (term.hasSelection()) {
                    const text = term.getSelection();
                    // Use Electron clipboard if you prefer; navigator works fine in Electron renderer
                    navigator.clipboard.writeText(text).catch(() => { });
                    // prevent SIGINT if we just copied
                    return false;
                }
                // no selection -> allow SIGINT to pass through
                return true;
            }

            // Paste
            if (ctrlOrCmd && key === "v") {
                navigator.clipboard.readText().then((text) => {
                    if (text) window.electron.terminal.write(terminal.id, text);
                }).catch(() => { });
                return false; // we've handled it
            }

            return true;
        });

        // 2) Optional: copy-on-select (toggle if you like)
        // term.onSelectionChange(() => {
        //   if (term.hasSelection()) {
        //     navigator.clipboard.writeText(term.getSelection()).catch(() => {});
        //   }
        // });

        // 3) Right-click context menu (optional but nice)
        // If you have a main-process menu, you can trigger it via IPC.
        // Here’s a simple local behavior: paste on right-click if no selection; copy if there is.
        term.element?.addEventListener("contextmenu", async (e) => {
            e.preventDefault();
            if (term.hasSelection()) {
                const text = term.getSelection();
                await navigator.clipboard.writeText(text).catch(() => { });
                term.clearSelection();
            } else {
                const text = await navigator.clipboard.readText().catch(() => "");
                if (text) window.electron.terminal.write(terminal.id, text);
            }
        });

        // ---- resize PTY when terminal size changes ----
        const fitAndResize = () => {
            fitAddon.fit();
            window.electron.terminal.resize(terminal.id, term.cols, term.rows);
        };
        fitAndResize();
        window.addEventListener("resize", fitAndResize);

        term.focus();

        return () => {
            window.removeEventListener("resize", fitAndResize);
            term.dispose();
            xtermRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!termRef.current || initiated) return;
        setInitiated(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (terminal.initialCommand) {
                window.electron.terminal.write(terminal.id, terminal.initialCommand);
                window.electron.terminal.write(terminal.id, "\n");
            }
        }, 1e3);
    }, [termRef.current]);

    return (
        <Box sx={{ pb: 8, height: '100%' }}>
            <Box
                ref={termRef}
                sx={{ width: "100%", height: "100%", overflow: "hidden" }}
            />
        </Box>
    );
}
