import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

import img1 from "../../../assets/1358310.png";
import { RecentIcon } from "components/icons";


export default function ProjectShortcuts() {
    return <Grid container spacing={2}>
        {
            [1, 2, 3, 4].map(item => <Grid key={item} size={{ xs: 12, sm: 6 }} >
                <ProjectShortcut />
            </Grid>)
        }
    </Grid>
}

export function ProjectShortcut() {
    return <Button
        LinkComponent={Link}
        href="/projects"
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
        <RecentIcon width={40} height={40} />

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
        >Last Project</Typography>
        <BgStyle />
    </Button>
}


function BgStyle({ }) {
    return <>
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            backgroundImage: `url(${img1.src})`,
            backgroundSize: 'cover',
            zIndex: -1
        }} />
        <Box sx={theme => ({
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            opacity: .7,
            zIndex: -1
        })} />
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            opacity: .3,
            bgcolor: 'black',
            zIndex: -1
        }} />
    </>
}