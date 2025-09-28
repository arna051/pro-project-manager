import { useEffect, useRef, useState } from "react";
import type { Terminal as TType } from "../type";
import { Terminal } from "@xterm/xterm";
import { Box, useTheme } from "@mui/material";

let timeout: any = null
export default function TerminalXterm({ terminal }: { terminal: TType }) {
    const termRef = useRef<HTMLDivElement | null>(null);

    const theme = useTheme();

    const [initiated, setInitiated] = useState(false);

    useEffect(() => {
        const term = new Terminal({
            fontFamily: "monospace",
            fontSize: 14,
            cursorBlink: true,
            allowTransparency: true,
            theme: {
                background: "#00000010",
                foreground: theme.palette.text.primary,
                selectionBackground: "#00000010"
            },
        });

        term.open(termRef.current!);

        // show output from shell
        window.electron.terminal.onData(terminal.id, (data) => {
            term.write(data);
        });

        // forward keystrokes to shell
        term.onData((input) => {
            window.electron.terminal.write(terminal.id, input);
        });

        const fit = () => {
            const cols = term.cols;
            const rows = term.rows;
            window.electron.terminal.resize(terminal.id, cols, rows);
        };
        fit();

        term.focus();
        return () => {
            term.dispose();
        };
    }, []);

    useEffect(() => {
        if (!termRef.current || initiated) return;
        setInitiated(true);
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            if (terminal.initialCommand) {
                window.electron.terminal.write(terminal.id, terminal.initialCommand);
                window.electron.terminal.write(terminal.id, "\n");
            }
        }, 1e3);
    }, [termRef.current])

    return (
        <Box sx={{ pb: 8 }}>
            <Box
                ref={termRef}
                sx={{
                    width: "100%",
                    height: "100%",
                    overflow: 'hidden'
                }}
            />
        </Box>
    );
}