import { Box, Button, Card, CardContent, CardHeader, Chip, Grid, Stack, Typography } from "@mui/material";
import ProjectsButton from "./components/project-button";
import LastProject from "./components/last-project";
import ProjectShortcuts from "./components/project-icon";
import { InfoIcon, SeeMoreIcon, VscodeIcon } from "components/icons";
import Link from "next/link";
import Reminders from "./components/reminders";
import GalleryWight from "./components/gallery";
import ServersShortcuts from "./components/servers";
import Image from "next/image";
import hippo from "../../assets/hippogriff.png"

export default function DashboardView() {
    return <Box sx={{ p: 2, pt: 6 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={2}>
                <Box sx={{
                    bgcolor: 'primary.main',
                    width: 75,
                    height: 75
                }}>
                    <VscodeIcon width={70} height={70} />
                </Box>
                <Stack gap={1}>
                    <Typography variant="h4">
                        Projects {" "}
                        <Typography variant="subtitle2" component="span" color="text.secondary" fontWeight="bold">
                            & Contracts
                        </Typography>
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Chip
                            variant="filled"
                            color="primary"
                            label="Engineering"
                            sx={{ flex: 'auto' }}
                        />
                        <Chip
                            variant="filled"
                            color="secondary"
                            label="Jobs"
                            sx={{ flex: 'auto' }}
                        />
                    </Stack>
                </Stack>
            </Stack>
            <Button
                variant="contained"
                size="large"
                startIcon={<SeeMoreIcon />}
                LinkComponent={Link}
                href="/projects"
            >See More</Button>
        </Stack>
        <Stack direction="row" gap={2} width="100%" sx={{ mt: 2 }}>
            <ProjectsButton />
            <LastProject />
        </Stack >


        <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <ProjectShortcuts />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <GalleryWight />
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Reminders />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <ServersShortcuts />
                <Card sx={{ height: 170, mt: 2 }}>
                    <CardHeader
                        avatar={<InfoIcon />}
                        title="Hippogriff Engineering"
                        subheader="Engineering and Design Team"
                    />
                    <CardContent>
                        <Image
                            src={hippo.src}
                            height={40}
                            width={40}
                            alt="Logo"
                            style={{ float: 'left' }}
                        />

                        <Typography variant="caption">
                            Got an idea, a project, or just a crazy experiment you want to bring to life? We’d love to hear from you.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Box>
}