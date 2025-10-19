import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

import img1 from "../../../assets/1358310.png";
import { RecentIcon } from "components/icons";
import { IProject } from "@electron/model/project";
import { ICONS } from "@next/constants/repo-icons";
import { FsAvatar } from "@next/components/avatar";


export default function ProjectShortcuts({ projects }: { projects: IProject[] }) {
    return <Grid container spacing={2}>
        {
            projects.map(item => <Grid key={`${item._id}`} size={{ xs: 12, sm: 6 }} >
                <ProjectShortcut project={item} />
            </Grid>)
        }
    </Grid>
}

export function ProjectShortcut({ project }: { project: IProject }) {
    return <Button
        LinkComponent={Link}
        href={`/projects/show?id=${project._id}`}
        sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.primary',
            position: 'relative',
            overflow: 'hidden',
            flexDirection: 'column',
            width: '100%',
            gap: 2
        }}
    >

        <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '90%'
            }}
        >{project.title}</Typography>
        <Stack direction="row" gap={1}>
            {
                project
                    .repos
                    ?.map(z => z.icon.map(x => <Box component="span" key={x} children={ICONS.find(c => c.value === x)?.icon} />))
            }
        </Stack>
        <BgStyle bg={project.image} />
    </Button>
}


function BgStyle({ bg }: { bg: string }) {
    return <>
        <FsAvatar
            variant="square"
            src={bg}
            sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
            }} />
        <Box sx={theme => ({
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            opacity: .2,
            zIndex: -1
        })} />
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            // background: `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            bgcolor: 'background.paper',
            opacity: .6,
            zIndex: -1
        }} />
    </>
}