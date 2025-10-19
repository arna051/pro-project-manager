import { IServer } from "@electron/model/server";
import { ISetting } from "@electron/model/settings";
import { Box, Button, Chip, Grid, Menu, MenuItem, Typography } from "@mui/material";
import { SETTINGS } from "@next/constants/settings";
import { useTerminal } from "@next/terminal";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";


export default function ServersShortcuts({ servers }: { servers: IServer[] }) {
    return <Grid container spacing={2}>
        {
            servers.slice(0, 4).map(item => <Grid key={`${item._id}`} size={{ xs: 12, sm: 6 }} >
                <ServerShortcut server={item} />
            </Grid>)
        }
    </Grid>
}

export function ServerShortcut({ server }: { server: IServer }) {
    const { create } = useTerminal();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setAnchorEl(null);
        try {
            const bash = `ssh ${server.user}@${server.host} -p ${server.port}`;

            const settings = await window.electron.db.find<ISetting>("Setting");

            const terminalExternal = settings.find(x => x.key === SETTINGS.terminal)
            const terminalExternalProxied = settings.find(x => x.key === SETTINGS.proxyTerminal)

            switch ((e.target as any).dataset.id) {
                case "internal-proxied":
                    create(`${server.user}@${server.host}`, `proxychains4 ${bash}`)
                    break;
                case "external":
                    if (terminalExternal) {
                        const [script, ...args] = terminalExternal.value.split(" ").map(x => x.replace("$1", bash)).filter(Boolean);
                        await window.electron.terminal.execute(script, args)
                    }
                    else toast.warning("terminal is not configured in settings")
                    break;
                case "external-proxied":
                    if (terminalExternalProxied) {
                        const [script, ...args] = terminalExternalProxied.value.split(" ").map(x => x.replace("$1", bash)).filter(Boolean);
                        await window.electron.terminal.execute(script, args)
                    }
                    else toast.warning("terminal is not configured in settings")
                    break;

                case "internal":
                    create(`${server.user}@${server.host}`, `${bash}`)
                    break;

                default:
                    break;
            }
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot run the command.")
        }
    };


    return <>
        <Button
            aria-label="run ssh" onClick={handleClick}
            sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.primary',
                position: 'relative',
                overflow: 'hidden',
                flexDirection: 'column',
                width: '100%',
                gap: .5
            }}
        >
            <Box>
                <Chip variant="filled" label={server.user} size="small" color={server.user === 'root' ? "error" : "primary"} sx={{ m: .5 }} />
                <Chip variant="filled" label={server.host} size="small" sx={{ m: .5 }} />
            </Box>
            <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '90%'
                }}
            >{server.title}</Typography>
            <Typography
                variant="caption"
                fontWeight="bold"
                textAlign="center"
                color="text.secondary"
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '90%'
                }}
            >{server.user}@{server.host} -p {server.port}</Typography>
            <BgStyle />
        </Button>

        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={handleClose} data-id="internal">App Terminal</MenuItem>
            <MenuItem onClick={handleClose} data-id="internal-proxied">Proxied App Terminal</MenuItem>
            <MenuItem onClick={handleClose} data-id="external">External Terminal</MenuItem>
            <MenuItem onClick={handleClose} data-id="external-proxied">Proxied External Terminal</MenuItem>
        </Menu>
    </>
}


function BgStyle({ }) {
    return <>
        <Box sx={theme => ({
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: `linear-gradient(45deg,${theme.palette.success.main} 0%, transparent 100%)`,
            opacity: .4,
            zIndex: -1
        })} />
    </>
}