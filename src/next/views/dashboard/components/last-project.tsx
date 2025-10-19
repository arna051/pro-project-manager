import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import Link from "next/link";

import img1 from "../../../assets/1358310.png";
import { RecentIcon } from "components/icons";
import { IProject } from "@electron/model/project";
import { ICONS } from "@next/constants/repo-icons";
import { FsAvatar } from "@next/components/avatar";

export default function LastProject({ project }: { project: IProject }) {

    if (!project) return <Skeleton
        variant="rounded"
        sx={{
            flex: '1 1 auto',
            height: 200,
        }}
    />
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
            flex: '1 1 auto',
            gap: 2
        }}
    >
        <Stack>
            <Typography variant="h6" fontWeight="bold">{project.title}</Typography>
            <Stack direction="row" gap={1}>
                {
                    project
                        .repos
                        ?.map(z => z.icon.map(x => <Box component="span" key={x} children={ICONS.find(c => c.value === x)?.icon} />))
                }
            </Stack>
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
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            opacity: .5,
            bgcolor: 'black',
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
            opacity: .4,
            zIndex: -1
        }} />
    </>
}