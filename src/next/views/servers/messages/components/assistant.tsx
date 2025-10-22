"use client";

import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
    content: string
    reasoning_content?: string
}
export default function AssistantMessage({ content, reasoning_content }: Props) {
    return <Paper
        sx={theme => ({
            p: 1.5,
            maxWidth: '80%',
            alignSelf: 'start',
            minWidth: 200,
            backgroundColor: theme.palette.common.black,
            my: 1
        })}
    >
        <Typography variant="caption" color="text.secondary">
            Assistant
        </Typography>
        <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" fontSize={10} sx={{ opacity: .7 }} color="text.secondary">{reasoning_content}</Typography>

            <Box sx={{
                '& a,p,li': {
                    fontSize: 12
                },
                '& h1': {
                    fontSize: 18
                },
                '& h2': {
                    fontSize: 17
                },
                '& h3': {
                    fontSize: 16
                },
                '& h4': {
                    fontSize: 15
                },
                '& h5': {
                    fontSize: 14
                },
                '& h6': {
                    fontSize: 13
                },
            }}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </Box>
        </Box>
    </Paper>
}