"use client";
import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import BGFade from "components/bg-fade";
import ProjectsHero from "./components/hero";
import Search from "./components/search";
import { ProjectsTable } from "./components/table";
import type { IProject } from "../../../electron/model/project";
import { toast } from "sonner";
import { getProjects } from "@next/api/projects";

type ProjectRecord = IProject;

export default function ProjectsView() {
    const [projects, setProjects] = useState<ProjectRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string[]>([]);


    const load = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(
                data
            );
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = (id: string) => {
        window.electron.db.remove("Project", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    useEffect(() => {
        load();
    }, []);

    const filteredProjects = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch = normalizedSearch
                ? [project.title, project.description]
                    .filter(Boolean)
                    .some((field) => field!.toLowerCase().includes(normalizedSearch))
                : true;

            if (!matchesSearch) return false;

            if (!category.length) return true;

            return project.categoryIds.some(x => category.includes(x as any))
        });
    }, [projects, search, category]);

    return (
        <Box sx={{ position: "relative", minHeight: "100%" }}>
            <BGFade height={800} />
            <Box sx={{ position: "relative", p: 2, pt: 6 }}>
                <ProjectsHero />
                <Search
                    search={search}
                    onSearchChange={(value) => setSearch(value)}
                    category={category}
                    onCategory={setCategory}
                />
                <ProjectsTable
                    projects={filteredProjects}
                    loading={loading}
                    onDelete={handleDelete}
                />
            </Box>
        </Box>
    );
}
