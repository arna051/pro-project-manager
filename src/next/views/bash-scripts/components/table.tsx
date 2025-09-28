import { IBashScript } from "@electron/model/bashscript";
import { Card, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import RunButton from "@next/components/exec-button/run";
import { DeleteIcon, EditIcon } from "@next/components/icons";
import Link from "next/link";


type Props = { scripts: IBashScript[], }
export default function BashTable({ scripts }: Props) {

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
                                </Stack>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Card>
}
