import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

import img1 from "../../../assets/1358310.png";
import { RecentIcon } from "components/icons";

export default function LastProject() {
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
            flex: '1 1 auto',
            gap: 2
        }}
    >
        <RecentIcon width={50} height={50} />
        <Stack>
            <Typography variant="h6" fontWeight="bold">Last Project</Typography>
            <Typography variant="body2" color="text.secondary">
                the last project you was working on!
            </Typography>
        </Stack>
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
            opacity: .4,
            zIndex: -1
        })} />
    </>
}