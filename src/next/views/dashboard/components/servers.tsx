import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import Link from "next/link";


export default function ServersShortcuts() {
    return <Grid container spacing={2}>
        {
            [1, 2, 3, 4].map(item => <Grid key={item} size={{ xs: 12, sm: 6 }} >
                <ServerShortcut />
            </Grid>)
        }
    </Grid>
}

export function ServerShortcut() {
    return <Button
        LinkComponent={Link}
        href="/servers"
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
            gap: .5
        }}
    >
        <Box>
            <Chip variant="filled" label="Youth" size="small" color="primary" sx={{ m: .5 }} />
            <Chip variant="filled" label="Savior" size="small" sx={{ m: .5 }} />
        </Box>
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
        >Recent Server</Typography>
        <Typography
            variant="caption"
            fontWeight="bold"
            textAlign="center"
            color="text.secondary"
            sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '90%'
            }}
        >root@192.67.2.43</Typography>
        <BgStyle />
    </Button>
}


function BgStyle({ }) {
    return <>
        <Box sx={theme => ({
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            background: `linear-gradient(45deg,${theme.palette.success.main} 0%, transparent 100%)`,
            opacity: .4,
            zIndex: -1
        })} />
    </>
}