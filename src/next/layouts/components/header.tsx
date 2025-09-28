"use client";

import { AppBar, Badge, Box, CircularProgress, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { DeployIcon, ExitIcon, MinesIcon } from "components/icons";
import Image from "next/image";
import logo from "../assets/logo-512.png"
import { useDeploy } from "@next/deploy/context";

export default function Header() {

    const { deploying, deploys, open } = useDeploy();

    return <AppBar
        position="fixed"
        className="header"
        sx={theme => ({ zIndex: 999999, boxShadow: 'none', borderBottom: `1px solid ${theme.palette.divider}`, })}
    >
        <Stack direction="row" gap={1} sx={{ pl: 1 }} alignItems="center">

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
            {
                !!deploys && <Stack direction="row" alignItems="center" gap={2} sx={{ px: 1, bgcolor: 'warning.main', color: "black" }}>
                    {
                        !!deploying && <>
                            <CircularProgress size={13} color="inherit" thickness={4} />
                            <Typography fontSize={12} color="inherit">
                                {deploying} is in progress
                            </Typography>
                        </>
                    }
                    <Stack direction="row" alignItems="center">
                        <IconButton className="noDrag" onClick={open}>
                            <DeployIcon width={18} height={18} />
                        </IconButton>
                        <Typography fontSize={12} color="inherit" fontWeight="bold">
                            {deploys}
                        </Typography>
                    </Stack>
                </Stack>
            }
            <Stack direction="row" alignItems="center">
                <IconButton className="noDrag" sx={{
                    borderRadius: 0,
                }}>
                    <MinesIcon width={18} height={18} />
                </IconButton>
                <IconButton className="noDrag" sx={{
                    borderRadius: 0,
                    ':hover': {
                        bgcolor: 'error.main'
                    }
                }}>
                    <ExitIcon width={18} height={18} />
                </IconButton>
            </Stack>
        </Stack>
    </AppBar>
}
