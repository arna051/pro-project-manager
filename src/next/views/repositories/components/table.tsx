import { IRepo } from "@electron/model/repo";
import { Card, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { FsAvatar } from "@next/components/avatar";
import { CloneButton, DeployButton, IDEButton, OpenFolder, PlayButton } from "@next/components/exec-button";
import { GitButton } from "@next/components/exec-button/git";
import { DeleteIcon, EditIcon } from "@next/components/icons";
import { ICONS } from "@next/constants/repo-icons";
import Link from "next/link";


type Props = { repos: IRepo[], onDelete: (id: string) => any, }
export default function ReposTable({ repos, onDelete }: Props) {
    return <Card sx={{ position: 'relative', maxWidth: '95%', mx: 'auto' }} className="glassy">
        <TableContainer sx={{ position: 'relative' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10}>#</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Technologies</TableCell>
                        <TableCell width={100}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        repos.map((x, i) => <TableRow key={x._id.toString()}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>
                                <Stack direction="row" gap={1} alignItems="center">
                                    <FsAvatar
                                        variant="rounded"
                                        src={`${x.project?.image}`}
                                    />
                                    <Stack>
                                        <Typography variant="subtitle2">
                                            {x.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {x.project?.title}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" gap={.5}>
                                    {
                                        x.icon
                                            .map(c => ICONS.find(t => t.value === c))
                                            .filter(Boolean)
                                            .map(c => <Chip
                                                label={c?.name}
                                                key={c?.value}
                                                icon={c?.icon}
                                            />)
                                    }
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" justifyContent="end">
                                    <IconButton size="small" color="error" aria-label="Delete category" onClick={() => onDelete(x._id.toString())}>
                                        <DeleteIcon width={18} height={18} />
                                    </IconButton>
                                    <IconButton
                                        LinkComponent={Link}
                                        href={`/repos/save?id=${x._id}`}
                                        size="small"
                                        color="primary"
                                        aria-label="Edit category">
                                        <EditIcon width={18} height={18} />
                                    </IconButton>
                                    <CloneButton
                                        repositoryId={`${x._id}`}
                                    />
                                    <GitButton
                                        path={x.path}
                                        title={x.title}
                                    />
                                    <DeployButton
                                        repo={x}
                                    />
                                    <PlayButton
                                        title={`dev: ${x.title}`}
                                        command={x.devCommand}
                                        pwd={x.path}
                                    />
                                    <OpenFolder
                                        path={x.path}
                                    />
                                    <IDEButton
                                        path={x.path}
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
