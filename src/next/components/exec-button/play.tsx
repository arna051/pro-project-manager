import { IconButton, Menu, MenuItem } from "@mui/material"
import { PlayIcon } from "../icons"
import React from "react"
import { toast } from "sonner"
import { useTerminal } from "@next/terminal"
import { SETTINGS } from "@next/constants/settings"
import type { ISetting } from "@electron/model/settings"

type Props = {
    title: string
    command: string
    size?: number
    pwd: string
}
export function PlayButton({ command, size = 18, title, pwd }: Props) {

    const { create } = useTerminal();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setAnchorEl(null);
        try {
            const bash = command;

            const settings = await window.electron.db.find<ISetting>("Setting");

            const terminalExternal = settings.find(x => x.key === SETTINGS.terminal)
            const terminalExternalProxied = settings.find(x => x.key === SETTINGS.proxyTerminal)

            switch ((e.target as any).dataset.id) {
                case "internal-proxied":
                    create(title, `cd "${pwd}" && proxychains4 ${bash}`)
                    break;
                case "external":
                    if (terminalExternal) {
                        const [script, ...args] = terminalExternal.value.split(" ").map(x => x.replace("$1", `cd "${pwd}" && ${bash}`)).filter(Boolean);
                        await window.electron.terminal.execute(script, args)
                    }
                    else toast.warning("terminal is not configured in settings")
                    break;
                case "external-proxied":
                    if (terminalExternalProxied) {
                        const [script, ...args] = terminalExternalProxied.value.split(" ").map(x => x.replace("$1", `cd "${pwd}" && ${bash}`)).filter(Boolean);
                        await window.electron.terminal.execute(script, args)
                    }
                    else toast.warning("terminal is not configured in settings")
                    break;

                default:
                    create(title, `cd "${pwd}" &&  ${bash}`)
                    break;
            }
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot run the command.")
        }
    };



    return <>
        <IconButton size="small" aria-label="run script" onClick={handleClick}>
            <PlayIcon width={size} height={size} />
        </IconButton>
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