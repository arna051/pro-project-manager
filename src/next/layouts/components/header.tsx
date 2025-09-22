"use client";

import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { ExitIcon, MinesIcon } from "components/icons";
import Image from "next/image";
import logo from "../assets/logo-512.png"

export default function Header() {

    return <AppBar
        position="fixed"
        className="header"
        sx={theme => ({ zIndex: 999999, boxShadow: 'none', borderBottom: `3px solid ${theme.palette.text.primary}`, })}
    >
        <Stack direction="row" gap={1} sx={{ px: 1 }} alignItems="center">

            <Image
                src={logo.src}
                width={24}
                height={24}
                alt="logo"
            />

            <Typography variant="caption" fontWeight="bold">
                Project Manager Pro
            </Typography>

            <Box sx={{ flex: '1 1 auto' }} />

            <IconButton className="noDrag">
                <MinesIcon />
            </IconButton>
            <IconButton className="noDrag">
                <ExitIcon />
            </IconButton>
        </Stack>
    </AppBar>
}
