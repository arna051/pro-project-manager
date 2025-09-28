import { INote } from "@electron/model/note";
import { Card, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { DeleteIcon, EditIcon, SeeMoreIcon } from "@next/components/icons";
import Link from "next/link";


type Props = { notes: INote[], onDelete: (id: string) => any, }
export default function NotesTable({ notes, onDelete }: Props) {
    return <Card sx={{ position: 'relative', maxWidth: '95%', mx: 'auto' }} className="glassy">
        <TableContainer sx={{ position: 'relative' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10}>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell width={150}>Sections</TableCell>
                        <TableCell width={40}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        notes.map((x, i) => <TableRow key={x._id.toString()}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{x.title}</TableCell>
                            <TableCell>
                                <Chip label={`${x.content.length} sections`} />
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" justifyContent="end">
                                    <IconButton size="small" color="error" aria-label="Delete Note" onClick={() => onDelete(x._id.toString())}>
                                        <DeleteIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton
                                        LinkComponent={Link}
                                        href={`/notes/save?id=${x._id}`}
                                        size="small"
                                        color="warning"
                                        aria-label="Edit Note">
                                        <EditIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton
                                        LinkComponent={Link}
                                        href={`/notes/show?id=${x._id}`}
                                        size="small"
                                        color="primary"
                                        aria-label="See Note">
                                        <SeeMoreIcon width={18} height={18} />
                                    </IconButton>
                                </Stack>
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Card>
}
