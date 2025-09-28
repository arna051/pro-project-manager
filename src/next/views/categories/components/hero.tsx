"use client"
import { Stack, Typography } from "@mui/material";
import { CategoryIcon } from "components/icons";

export default function CategoriesHero() {
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
                <CategoryIcon width={60} height={60} />
            </Stack>
            <Stack gap={.5}>
                <Typography variant="h4" fontWeight="bold">
                    Categories
                </Typography>
                <Typography variant="subtitle2">
                    Split projects and jobs contracts
                </Typography>
            </Stack>
        </Stack>
    </Stack>
}