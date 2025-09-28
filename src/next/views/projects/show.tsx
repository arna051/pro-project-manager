import { IProject } from "@electron/model/project";
import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, IconButton, List, ListItem, ListItemText, Rating, Stack, Typography } from "@mui/material";
import { getProject } from "@next/api/projects";
import BGFade from "@next/components/bg-fade";
import { AddIcon, ProjectIcon, RepoIcon, ServerIcon, TerminalIcon, VscodeIcon } from "@next/components/icons";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RepoProjectTable from "./components/repo-table";
import ProjectServer from "./components/servers";
import ProjectDesc from "./components/desc";
import Contractors from "./components/contractors";
import ProjectTodo from "./components/todo";

export default function ProjectShow() {

    const params = useSearchParams();

    const id = params.get("id");

    const [project, setProject] = useState<IProject>();

    function load() {
        getProject(id || "")
            .then(res => setProject(res))
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load project!"))
    }

    useEffect(load, []);

    if (!project) return null;

    return <Box sx={{ position: 'relative' }}>
        <BGFade height={800} images={[project.image]} />
        <Box sx={{ p: 2, pt: 6, position: 'relative' }}>
            <Stack direction="row" gap={2} alignItems="center">
                <ProjectIcon width={75} height={75} />
                <Stack sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4" fontWeight="bold">{project.title}</Typography>
                    <Rating
                        readOnly
                        value={project.priority}
                    />
                </Stack>
                <Stack direction="row" gap={1}>
                    {
                        project?.categories?.slice(0, 2).map(x => <Chip key={`${x._id}`} label={x.title} />)
                    }
                </Stack>
            </Stack>

            <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack gap={2}>
                        <RepoProjectTable repos={project.repos} />
                        <ProjectDesc value={project.description} />
                        <ProjectTodo project={project} reload={load} />
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack gap={2}>
                        <ProjectServer servers={project.servers} projectId={`${project._id}`} reload={load} />
                        <Contractors contractors={project.contractors} />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    </Box>
}