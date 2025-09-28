import { Box, InputBase, Paper, Stack } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import GradientButton from "@next/components/gradient-button";
import { AddIcon } from "components/icons";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
    name: string
    icon?: ReactNode
}
export default function RHFSingle({ name, icon }: Props) {

    const { control } = useFormContext();

    const theme = useTheme();

    const gradient = (theme: Theme, deg: number = 45) => `linear-gradient(${deg}deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`

    return <Controller
        control={control}
        name={name}
        render={({ field }) => <Box
            sx={{
                position: 'relative',
                width: '100%'
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                component={Paper}
                gap={2}
                sx={{
                    p: .5,
                    overflow: 'hidden',
                    transition: 'all .2s ease',
                    px: 2,
                    borderRadius: 3,
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
                        filter: 'blur(40px)',
                        transition: 'all .4s ease',
                    },
                    ':hover': {
                        ':after': {
                            background: gradient(theme, -45),
                        },
                    }
                }}
            >
                {icon || <AddIcon />}
                <InputBase
                    fullWidth
                    placeholder="Category Name"
                    sx={{
                        p: 1
                    }}
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                />
                <GradientButton type="submit">
                    Save
                </GradientButton>
            </Stack>
        </Box>}
    />
}