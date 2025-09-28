"use client";

import { alpha, Box, Dialog, DialogContent, DialogProps, DialogTitle, IconButton, Slide, Stack, Tab, Tabs, Typography } from "@mui/material"
import { DeployType } from "../type"
import { DeployIcon, ExitIcon } from "@next/components/icons"
import Deploy from "./deploy";

type Props = DialogProps & {
    onClose: VoidFunction
    deploys: DeployType[]
    closeDeploy: (id: string) => void
    activeTab: number
    setActiveTab: (tab: number) => void
}
export default function DeployDialog({ onClose, deploys, closeDeploy, activeTab, setActiveTab, ...props }: Props) {
    return <Dialog
        onClose={onClose}
        slotProps={{
            paper: {
                className: 'glassy-dark'
            },
        }}
        keepMounted
        fullScreen
        {...props}
    >
        <DialogTitle sx={theme => ({
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            boxShadow: `0 0 10px ${theme.palette.divider}`
        })}>
            <Box sx={{ height: 32 }} />
            <Stack direction="row" gap={2} alignItems="center">
                <DeployIcon />
                <Typography variant="subtitle2" fontWeight="bold">Deploys</Typography>
                <Box sx={theme => ({
                    flex: '1 1 auto',
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: alpha(theme.palette.background.default, .7)
                })}>
                    <Tabs value={activeTab} onChange={(_, n) => setActiveTab(n)} aria-label="deploys tabs">
                        {
                            deploys.map((x, i) => <Tab key={x.id} label={x.repo.title} value={i} />)
                        }
                    </Tabs>
                </Box>
                <IconButton onClick={onClose as any}>
                    <ExitIcon width={24} height={24} />
                </IconButton>
            </Stack>
        </DialogTitle>
        <DialogContent sx={{
            mt: 18,
            position: 'relative'
        }}>
            {
                deploys.map((deploy, i) => <Slide
                    key={deploy.id}
                    direction={i === activeTab ? "left" : "right"}
                    in={i === activeTab}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: 'hidden',
                            maxHeight: '100%'
                        }}
                    >
                        <Deploy deploy={deploy} />
                    </Box>
                </Slide>)
            }
        </DialogContent>
    </Dialog>
}