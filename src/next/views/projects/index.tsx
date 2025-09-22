"use client";
import { Box } from "@mui/material";
import BGFade from "components/bg-fade";
import ProjectsHero from "./components/hero";
import Search from "./components/search";
import { ProjectsTable } from "./components/table";
import { useEffect, useState } from "react";
import type { IProject } from "../../../electron/model/project"

export default function ProjectsView() {
    const [projects, setProjects] = useState<IProject[]>([]);

    useEffect(() => {
        (async () => {
            const data = await window.electron.db.find("Project");
            console.log(data);
            setProjects(data)
        })()

    }, [])
    return <Box sx={{ position: 'relative', height: '100%' }}>
        <BGFade height={600} />
        <Box sx={{ position: 'relative', p: 2, pt: 6 }}>
            <ProjectsHero />
            <Search />
            <ProjectsTable />
        </Box>
    </Box>
}