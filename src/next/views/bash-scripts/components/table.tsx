import { IBashScript } from "@electron/model/bashscript";
import { Card, IconButton, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import RunButton from "@next/components/exec-button/run";
import { DeleteIcon, EditIcon, TerminalIcon } from "@next/components/icons";
import { useTerminal } from "@next/terminal";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";


type Props = { scripts: IBashScript[], }
export default function BashTable({ scripts }: Props) {

    const { terminals, send } = useTerminal()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        setAnchorEl(null);
        try {

            const terminalId = (e.target as any).dataset.id;
            const script = (e.target as any).dataset.script;

            send(terminalId, script.concat("\n"))
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot run the command.")
        }
    };

    return <Card sx={{ position: 'relative', maxWidth: '95%', mx: 'auto' }} className="glassy">
        <TableContainer sx={{ position: 'relative' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10}>#</TableCell>
                        <TableCell >Name</TableCell>
                        <TableCell width={50}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        scripts.map((x, i) => <TableRow key={x._id.toString()}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{x.title}</TableCell>
                            <TableCell>
                                <Stack direction="row" justifyContent="end">
                                    <IconButton size="small" color="error" aria-label="Delete script" data-id={x._id}>
                                        <DeleteIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton
                                        LinkComponent={Link}
                                        href={`/bash-scripts/save?id=${x._id}`}
                                        size="small"
                                        color="primary"
                                        aria-label="Edit script">
                                        <EditIcon width={18} height={18} />
                                    </IconButton>

                                    <RunButton
                                        command={x.script}
                                        title={x.title}

                                    />


                                    {
                                        !!terminals.length && <>
                                            <IconButton
                                                size="small"
                                                color="warning"
                                                title="run on current terminals"
                                                aria-label="run ssh"
                                                onClick={handleClick}>
                                                <TerminalIcon width={18} height={18} />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                            >
                                                {
                                                    terminals.map((z, i) =>
                                                        <MenuItem
                                                            key={z.id}
                                                            onClick={handleClose}
                                                            data-id={z.id}
                                                            data-script={x.script}>
                                                            {i + 1}. {z.name}
                                                        </MenuItem>)
                                                }
                                            </Menu>
                                        </>
                                    }
                                </Stack>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Card>
}
