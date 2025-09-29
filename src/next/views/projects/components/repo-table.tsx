import { IRepo } from "@electron/model/repo"
import { Card, CardContent, CardHeader, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { CloneButton, DeployButton, IDEButton, OpenFolder, PlayButton } from "@next/components/exec-button"
import { GitButton } from "@next/components/exec-button/git"
import { AddIcon, DeployIcon, EditIcon, GitIcon, RepoIcon, VscodeIcon } from "@next/components/icons"
import { ICONS } from "@next/constants/repo-icons"
import Link from "next/link"
import { toast } from "sonner"

type Props = {
    repos?: IRepo[]
    projectId: string
}
export default function RepoProjectTable({ repos, projectId }: Props) {

    async function handleOpenAll() {
        try {
            const script = repos?.map(x => `code "${x.path}"`).join(" && ");
            if (!script) return;
            await window.electron.terminal.execute(script, [])
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot run open all script.")
        }
    }

    async function sync() {
        const elements = window.document.querySelectorAll<HTMLLinkElement>("a.git-button");
        const btns = Array.from(elements);

        for (let index = 0; index < btns.length; index++) {
            const b = btns[index];
            b.click();
            await new Promise(res => setTimeout(res, 3e3))
        }
    }
    async function deploy() {
        const elements = window.document.querySelectorAll<HTMLLinkElement>("a.deploy-button");
        const btns = Array.from(elements);

        for (let index = 0; index < btns.length; index++) {
            const b = btns[index];
            b.click();
            await new Promise(res => setTimeout(res, 2e3))
        }
    }

    return <Card className="glassy">
        <CardHeader
            avatar={<RepoIcon />}
            title="Repositories"
            subheader="the project parts & repositories."
            action={<>
                <IconButton onClick={sync}>
                    <GitIcon />
                </IconButton>
                <IconButton onClick={deploy}>
                    <DeployIcon />
                </IconButton>
                <IconButton onClick={handleOpenAll}>
                    <VscodeIcon />
                </IconButton>
                <IconButton
                    LinkComponent={Link}
                    href={`/repos/save?returnTo=${projectId}`}
                >
                    <AddIcon />
                </IconButton>
            </>}
        />
        <CardContent>
            {
                !!repos?.length ?
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={150}>Title</TableCell>
                                    <TableCell>Technology</TableCell>
                                    <TableCell width={40}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    repos.map(x => <TableRow key={`${x._id}`}>
                                        <TableCell>{x.title}</TableCell>
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
                                            <Stack direction="row">
                                                <IconButton
                                                    LinkComponent={Link}
                                                    href={`/repos/save?id=${x._id}&returnTo=${projectId}`}
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit Repo">
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
                    </TableContainer> :
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                        there is no repository linked to this project
                    </Typography>
            }

        </CardContent>
    </Card>

}