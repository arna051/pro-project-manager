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
}
export default function UserMessage({ content }: Props) {
    return <Paper
        sx={theme => ({
            p: 1.5,
            maxWidth: '80%',
            alignSelf: 'end',
            minWidth: 200,
            backgroundColor: theme.palette.background.default,
        })}
    >
        <Typography variant="caption" color="text.secondary">
            You
        </Typography>
        <Box sx={{ mt: 0.5 }}>
            <Box sx={{
                '& a,p,li': {
                    fontSize: 12
                },
                '& h1': {
                    fontSize: 20
                },
                '& h2': {
                    fontSize: 18
                },
                '& h3': {
                    fontSize: 16
                },
                '& h4': {
                    fontSize: 14
                },
                '& h5': {
                    fontSize: 12
                },
                '& h6': {
                    fontSize: 10
                },
            }}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </Box>
        </Box>
    </Paper>
}