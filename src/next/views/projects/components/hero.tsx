"use client"
import { Stack, Typography } from "@mui/material";
import GradientButton from "components/gradient-button";
import { AddIcon, ProjectIcon } from "components/icons";
import Link from "next/link";

export default function ProjectsHero() {
    return <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ position: 'relative' }}
    >
        <Stack
            direction="row"
            gap={2}
            alignItems="center"
        >
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={theme => ({
                    background: `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    width: 70,
                    height: 70,
                })}>
                <ProjectIcon width={60} height={60} />
            </Stack>
            <Stack gap={.5}>
                <Typography variant="h4" fontWeight="bold">
                    Projects
                </Typography>
                <Typography variant="subtitle2">
                    Customer projects and jobs contracts
                </Typography>
            </Stack>
        </Stack>

        <GradientButton
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            LinkComponent={Link}
            href="/projects/new"
        >
            New Project
        </GradientButton>
    </Stack>
}