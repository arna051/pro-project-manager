import { Button, ButtonProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export default function GradientButton({ sx = {}, ...props }: ButtonProps) {

    const gradient = (theme: Theme) => `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
    return <Button
        sx={theme => ({
            ...(typeof sx === 'function' ? sx(theme) : sx) as any,
            background: gradient(theme),
            position: 'relative',
            zIndex: 1,
            ':after': {

                content: '""',
                position: 'absolute',
                top: '8px',
                left: '8px',
                right: '-8px',
                bottom: '-8px',
                background: gradient(theme),
                borderRadius: '10px',
                zIndex: -1,
                filter: 'blur(12px)',
                opacity: 0.7,
            },
            ':before': {
                content: '""',
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                right: '-8px',
                bottom: '-8px',
                background: gradient(theme),
                borderRadius: '20px',
                zIndex: -1,
                filter: 'blur(30px)',
                opacity: 0.6,
            }
        })}
        {...props}
    />
}