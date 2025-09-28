import { IRepo } from "@electron/model/repo"
import { Card, CardContent, CardHeader, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { AddIcon, DeployIcon, GitIcon, PlayIcon, RepoIcon, VscodeIcon } from "@next/components/icons"
import { ICONS } from "@next/constants/repo-icons"

type Props = {
    repos?: IRepo[]
}
export default function RepoProjectTable({ repos }: Props) {
    return <Card className="glassy">
        <CardHeader
            avatar={<RepoIcon />}
            title="Repositories"
            subheader="the project parts & repositories."
            action={<>
                <IconButton>
                    <VscodeIcon />
                </IconButton>
                <IconButton>
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
                                                <IconButton>
                                                    <VscodeIcon width={18} height={18} />
                                                </IconButton>
                                                <IconButton>
                                                    <DeployIcon width={18} height={18} />
                                                </IconButton>
                                                <IconButton>
                                                    <GitIcon width={18} height={18} />
                                                </IconButton>
                                                <IconButton>
                                                    <PlayIcon width={18} height={18} />
                                                </IconButton>
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