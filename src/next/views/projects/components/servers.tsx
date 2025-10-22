import { IServer } from "@electron/model/server";
import { Button, Card, CardContent, CardHeader, IconButton, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import RunButton from "@next/components/exec-button/run";
import { AddIcon, DeleteIcon, ServerIcon, TerminalIcon } from "@next/components/icons";
import Link from "next/link";
import { toast } from "sonner";

export default function ProjectServer({ servers, projectId, reload }: { servers?: IServer[], projectId?: string, reload?: VoidFunction }) {
    async function removeServerFromProject(serverId: string) {
        try {
            await window.electron.db.update("Project", { _id: projectId }, { $pull: { serversIds: serverId } });
            const n = toast.success("server was pulled out from project server list.", {
                action: <Button size="small" onClick={() => {
                    window.electron.db.update("Project", { _id: projectId }, { $push: { serversIds: serverId } }).finally(reload);
                    toast.dismiss(n)
                }}>
                    Undo
                </Button>
            })
            reload?.();
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "operation failed!")
        }
    }
    return <Card className="glassy">
        {!!projectId && <CardHeader
            avatar={<ServerIcon />}
            title="Servers"
            subheader="linked server to this project."
            action={<IconButton
                LinkComponent={Link}
                href={`/servers?projectId=${projectId}`}
            >
                <AddIcon />
            </IconButton>}
        />}
        <CardContent>
            {
                !!servers?.length ?
                    <List dense>
                        {
                            servers?.map(x => <ListItem
                                key={`${x._id}`}
                                secondaryAction={
                                    <Stack direction="row">
                                        {!!projectId && <IconButton size="small" onClick={() => removeServerFromProject(`${x._id}`)}>
                                            <DeleteIcon width={18} height={18} />
                                        </IconButton>}

                                        <RunButton
                                            command={`ssh ${x.user}@${x.host} -p ${x.port}`}
                                            title={x.title}
                                        />
                                    </Stack>
                                }
                            >
                                <ListItemText
                                    primary={x.title}
                                    secondary={`${x.user}@${x.host}`}
                                />
                            </ListItem>)
                        }
                    </List> :
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                        there is no server linked to this project
                    </Typography>
            }
        </CardContent>
    </Card>
}