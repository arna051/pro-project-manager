import { IServer } from "@electron/model/server";
import { Card, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import RunButton from "@next/components/exec-button/run";
import { ConfigIcon, DeleteIcon, EditIcon, SelectIcon } from "@next/components/icons";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";


type Props = { servers: IServer[], onDelete: (id: string) => any, onConfig: (id: string) => any }
export default function ServersTable({ servers, onDelete, onConfig }: Props) {

    const params = useSearchParams();

    const router = useRouter();

    const projectId = params.get("projectId")

    function handleAddServerToProject(serverId: string) {
        window
            .electron
            .db
            .update("Project", { _id: projectId }, { $push: { serversIds: serverId } })
            .then(() => {
                toast.success("Server added to the project.");
                router.push(`/projects/show?id=${projectId}`)
            })
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot add it to your project"))
    }

    return <Card sx={{ position: 'relative', maxWidth: '95%', mx: 'auto' }} className="glassy">
        <TableContainer sx={{ position: 'relative' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10}>#</TableCell>
                        <TableCell width={150}>Name</TableCell>
                        <TableCell>user@host</TableCell>
                        <TableCell width={50}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        servers.map((x, i) => <TableRow key={x._id.toString()}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{x.title}</TableCell>
                            <TableCell>
                                <Chip
                                    variant="filled"
                                    color={x.user === 'root' ? "error" : "success"}
                                    label={`${x.user}@${x.host}`}
                                />
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" justifyContent="end">
                                    <IconButton size="small" color="error" aria-label="Delete Server" onClick={() => onDelete(x._id.toString())}>
                                        <DeleteIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton
                                        LinkComponent={Link}
                                        href={`/servers/save?id=${x._id}`}
                                        size="small"
                                        color="primary"
                                        aria-label="Edit Server">
                                        <EditIcon width={18} height={18} />
                                    </IconButton>
                                    {
                                        !!projectId && <IconButton
                                            onClick={() => handleAddServerToProject(`${x._id}`)}
                                            size="small"
                                            color="success"
                                            aria-label="Select Server">
                                            <SelectIcon width={18} height={18} />
                                        </IconButton>
                                    }
                                    <RunButton
                                        command={`ssh ${x.user}@${x.host} -p ${x.port}`}
                                        title={x.title}
                                    />
                                    <IconButton
                                        onClick={() => onConfig(x._id.toString())}
                                        size="small"
                                    >
                                        <ConfigIcon width={18} height={18} />
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
