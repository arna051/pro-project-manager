import { Avatar, Card, Chip, IconButton, Rating, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import img1 from "assets/ChatGPT Image May 2, 2025, 01_32_29 AM.png"
import { DeleteIcon, EditIcon, SeeMoreIcon } from "components/icons";


export function ProjectsTable() {
    return <Card sx={{ maxWidth: '95%', mx: 'auto', my: 4 }}>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10} align="center">#</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Contractor</TableCell>
                        <TableCell>Todo</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Last Check</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        new Array(50).fill(313).map((_, i) => <TableRow key={i}>
                            <TableCell align="center">{i + 1}</TableCell>
                            <TableCell>
                                <Stack direction="row" alignItems="center" gap={2}>
                                    <Avatar
                                        variant="rounded"
                                        src={img1.src}
                                        alt="NextJs"
                                    />
                                    <Stack>
                                        <Typography variant="subtitle1">NextJs</Typography>
                                        <Typography variant="caption" color="text.secondary">a personal nextjs project</Typography>
                                    </Stack>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Chip variant="filled" color="success" label="Ali Asadi - US" size="small" />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color="error"
                                    size="small"
                                    label="3"
                                />
                            </TableCell>
                            <TableCell>
                                <Rating
                                    value={4}
                                    size="small"
                                    readOnly
                                />
                            </TableCell>
                            <TableCell>{new Date().toDateString()}</TableCell>
                            <TableCell>
                                <Stack direction="row" justifyContent="end">
                                    <IconButton>
                                        <DeleteIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton>
                                        <EditIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton>
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