import { alpha, FormControlLabel, Stack, Switch, Typography } from "@mui/material";


type Props = {
    dashboard: boolean
    autoExecute: boolean
    setAutoExecute: any
}
export function ConfigBar({ autoExecute, dashboard, setAutoExecute }: Props) {
    return <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={theme => ({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            p: 2,
            gap: 1,
            backgroundColor: alpha(theme.palette.background.default, .6),
            backdropFilter: 'blur(6px)',
            zIndex: 2
        })}>
        <Typography variant="h6">
            {dashboard ? "AI Project Manager" : "AI Assistant"}
        </Typography>
        <Stack gap={1}>
            <FormControlLabel
                control={<Switch size="small" checked={autoExecute} onChange={(e) => setAutoExecute(e.target.checked)} />}
                label="Auto-execute"
                slotProps={{
                    typography: {
                        variant: 'caption'
                    }
                }}
            />
        </Stack>
    </Stack>
}