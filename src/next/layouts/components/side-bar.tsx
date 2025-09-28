"use client"

import { Box, IconButton, Stack, useColorScheme } from "@mui/material";
import { useEffect } from "react";
import Header from "./header";
import menuImage from "../../assets/menu.jpg"
import Drawer from "./drawer";
import { FleshLeftIcon, FleshRightIcon } from "components/icons";
import useLocalStorage from "hooks/useLocalstorage";
import TerminalProvider from "@next/terminal/provider";

type Props = ChildProp
export default function SideBar({ children }: Props) {

    const { setMode } = useColorScheme();

    const [drawerWidth, setDrawerWidth] = useLocalStorage({
        default: 60,
        key: 'drawerWidth',
        type: Number,
    })

    useEffect(() => {
        setMode("dark")
    }, [])

    return <Box sx={{ height: '100vh' }}>
        <Header />
        <Stack direction="row" alignItems="stretch" sx={{ height: '100%' }}>
            <Box
                sx={{
                    minWidth: drawerWidth,
                    maxHeight: '100%',
                    overflowY: 'scroll',
                    position: 'relative',
                    transition: 'all .3s ease'
                }}
            >

                <Box sx={{
                    maxHeight: '100%',
                    pt: 6,
                    overflowY: 'scroll',
                }}>
                    <Drawer flat={drawerWidth !== 300} />
                </Box>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    backgroundImage: `url(${menuImage.src})`,
                    backgroundSize: 'cover',
                    opacity: .5,
                    zIndex: -1
                }} />
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    opacity: .5,
                    zIndex: -1,
                    bgcolor: 'background.paper'
                }} />

                <IconButton
                    onClick={() => setDrawerWidth(last => last === 300 ? 60 : 300)}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        mx: 'auto',
                        left: drawerWidth !== 300 ? 0 : 'initial',
                        mt: 6
                    }}>
                    {
                        drawerWidth !== 300 ? <FleshRightIcon /> : <FleshLeftIcon />
                    }
                </IconButton>
            </Box>
            <Box sx={{
                flex: '1 1 auto',
                overflowY: 'scroll',
                maxHeight: '100%',
                position: 'relative'
            }}>
                <TerminalProvider>

                    <Box component="main" sx={{
                        overflowY: 'scroll',
                        maxHeight: '100%',
                        position: 'relative',
                        height: '100%'
                    }}>
                        {children}
                    </Box>
                </TerminalProvider>
            </Box>
        </Stack>
    </Box>
}