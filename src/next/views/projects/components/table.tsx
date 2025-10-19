import { Card, Chip, IconButton, Rating, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { DeleteIcon, EditIcon, SeeMoreIcon } from "components/icons";
import type { IProject } from "@electron/model/project";
import { FsAvatar } from "@next/components/avatar";
import Link from "next/link";

type ProjectLike = IProject

type ProjectsTableProps = {
    projects: ProjectLike[];
    loading?: boolean;
    onDelete: (id: string) => any
};

const formatDate = (value?: string | Date) => {
    if (!value) return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "—";
    return dayjs(date).format("MMM DD, YYYY");
};

export function ProjectsTable({ projects, loading = false, onDelete }: ProjectsTableProps) {
    return (
        <Card sx={{ maxWidth: "95%", mx: "auto", my: 4 }} className="glassy">
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width={10} align="center">#</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Contractors</TableCell>
                            <TableCell>Todos</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Last Check</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow key="loading">
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Loading projects…
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow key="empty">
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No projects found. Try adjusting your filters or create a new project.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project, index) => {
                                const priority = typeof project.priority === "number" ? project.priority : 0;
                                const todoCount = Array.isArray(project.todos) ? project.todos.length : 0;
                                const contractorCount = Array.isArray(project.contractorIds) ? project.contractorIds.length : 0;

                                return (
                                    <TableRow key={`${project._id}`} hover>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" gap={2}>
                                                <FsAvatar
                                                    variant="rounded"
                                                    sx={{
                                                        bgcolor: "primary.main",
                                                        color: "primary.contrastText",
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                    }}
                                                    src={project.image}
                                                >
                                                    {project.title?.[0] ?? "P"}
                                                </FsAvatar>
                                                <Stack spacing={0.25}>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {project.title ?? "Untitled project"}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={contractorCount ? "success" : "default"}
                                                size="small"
                                                label={contractorCount ? `${contractorCount} linked` : "No contractors"}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                color={todoCount ? "info" : "default"}
                                                size="small"
                                                label={`${todoCount}`}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" gap={1}>
                                                <Rating value={priority} precision={1} max={5} readOnly size="small" />

                                            </Stack>
                                        </TableCell>
                                        <TableCell>{formatDate(project.lastCheck ?? project.updatedAt ?? project.createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" justifyContent="flex-end" gap={0.5}>
                                                <IconButton
                                                    onClick={() => onDelete(`${project._id}`)}
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete project">
                                                    <DeleteIcon width={18} height={18} />
                                                </IconButton>
                                                <IconButton
                                                    LinkComponent={Link}
                                                    href={`/projects/new?id=${project._id}`}
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit project">
                                                    <EditIcon width={18} height={18} />
                                                </IconButton>
                                                <IconButton
                                                    LinkComponent={Link}
                                                    href={`/projects/show?id=${project._id}`}
                                                    size="small"
                                                    aria-label="Open project">
                                                    <SeeMoreIcon width={18} height={18} />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}
