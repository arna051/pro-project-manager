import { IconButton, Menu, MenuItem } from "@mui/material"
import { GitIcon } from "../icons"
import React from "react"
import { toast } from "sonner"
import { useTerminal } from "@next/terminal"

type Props = {
    title: string
    path: string
    size?: number
}
export function GitButton({ path, size = 18, title }: Props) {

    const { create } = useTerminal();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setAnchorEl(null);
        try {

            const push = `cd "${path}" && git add . && git commit -m "${new Date().toString()}" && git push origin --all && exit`;
            const pull = `cd "${path}" && git fetch --all && exit`;

            switch ((e.target as any).dataset.id) {
                case "push-proxied":
                    create(title, `proxychains4 ${await window.electron.terminal.createBash(push)}`)
                    break;
                case "pull":
                    create(title, pull)
                    break;
                case "pull-proxied":
                    create(title, `proxychains4 ${await window.electron.terminal.createBash(pull)}`)
                    break;

                default:
                    create(title, push)
                    break;
            }
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot run the command.")
        }
    };



    return <>
        <IconButton
            sx={{ display: 'none' }}
            className="git-button"
            LinkComponent="a"
            href="#"
            onClick={() => {
                const push = `cd "${path}" && git add . && git commit -m "${new Date().toString()}" && git push origin --all && exit`;
                create(title, push)
            }}
        />
        <IconButton size="small" aria-label="run script" onClick={handleClick}>
            <GitIcon width={size} height={size} />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={handleClose} data-id="push">Push</MenuItem>
            <MenuItem onClick={handleClose} data-id="push-proxied">Proxied Push</MenuItem>
            <MenuItem onClick={handleClose} data-id="pull">Pull</MenuItem>
            <MenuItem onClick={handleClose} data-id="pull-proxied">Proxied Pull</MenuItem>
        </Menu>
    </>
}