"use client"
import { Button, Stack, Typography } from "@mui/material";
import GradientButton from "components/gradient-button";
import { AddIcon } from "components/icons";
import Link from "next/link";
import { FC, ReactNode, SVGProps } from "react";


type Props = {
    icon: FC<SVGProps<SVGSVGElement>>
    title: string
    subtitle: string
    button?: {
        text: string
        icon?: ReactNode
        href?: string
    }
    reset?: VoidFunction
}
export default function Hero({ icon: Icon, subtitle, title, button, reset }: Props) {
    return <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ position: 'relative' }}
    >
        <Stack
            direction="row"
            gap={2}
            alignItems="center"
        >
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={theme => ({
                    background: `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    width: 70,
                    height: 70,
                })}>
                <Icon width={60} height={60} />
            </Stack>
            <Stack gap={.5}>
                <Typography variant="h4" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="subtitle2">
                    {subtitle}
                </Typography>
            </Stack>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center" justifyContent="end">
            {
                !!reset && <Button onClick={reset}>
                    Reset
                </Button>
            }
            {
                !!button && button.href && <GradientButton
                    startIcon={button.icon || <AddIcon />}
                    variant="contained"
                    color="primary"
                    LinkComponent={Link}
                    href={button.href}
                >
                    {button.text}
                </GradientButton>
            }
            {
                !!button && !button.href && <GradientButton
                    startIcon={button.icon || <AddIcon />}
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    {button.text}
                </GradientButton>
            }
        </Stack>
    </Stack>
}