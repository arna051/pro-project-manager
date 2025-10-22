
"use client";

import {
    IconButton, InputAdornment, InputBase, Stack,
    alpha,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { StopIcon } from "@next/components/icons";

type Props = {
    send: (args: any) => any,
    apiKey?: string
    loading: boolean
    abort: VoidFunction
}
export function Composer({ abort, apiKey, loading, send }: Props) {
    const [input, setInput] = useState("");

    function handleSend() {
        send({
            message: {
                role: 'user',
                content: input
            },
            model: apiKey ? 'deepseek-reasoner' : 'llama3.1:8b'
        })
        setInput("")
    }
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return useMemo(() => <Stack direction="row" sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, gap: 1, zIndex: 2 }}>
        <InputBase
            sx={theme => ({
                flex: "1 1 auto",
                borderRadius: 2,
                bgcolor: "background.paper",
                p: 2,
                backgroundColor: alpha(theme.palette.background.default, .6),
                backdropFilter: 'blur(6px)',
                border: `1px solid ${theme.palette.divider}`
            })}
            multiline
            minRows={1}
            maxRows={6}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to do something… "
            onKeyDown={onKeyDown}
            endAdornment={
                <InputAdornment position="end">
                    {
                        loading ?
                            <IconButton title="Stop"
                                onClick={abort}>
                                <StopIcon />
                            </IconButton> :
                            <IconButton title="Ask AI"
                                onClick={handleSend}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    viewBox="0 0 24 24"
                                    style={{
                                        rotate: '45deg'
                                    }}>
                                    <g fill="none">
                                        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                                        <path fill="currentColor"
                                            d="M20.235 5.686c.432-1.195-.726-2.353-1.921-1.92L3.709 9.048c-1.199.434-1.344 2.07-.241 2.709l4.662 2.699l4.163-4.163a1 1 0 0 1 1.414 1.414L9.544 15.87l2.7 4.662c.638 1.103 2.274.957 2.708-.241z" />
                                    </g>
                                </svg>
                            </IconButton>
                    }
                </InputAdornment>
            }
        />
    </Stack>, [loading, input])
}