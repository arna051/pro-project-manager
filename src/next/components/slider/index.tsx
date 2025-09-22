"use client";

import { Box, Slide } from "@mui/material";
import { useEffect, useState } from "react";
import img1 from "../../assets/1358310.png";
import img2 from "../../assets/coder-programming-computer-screen-computer.jpg";
import img3 from "../../assets/coding-background-9izlympnd0ovmpli.jpg";

type Props = {
    images?: string[]
    zIndex?: number
    bgDark?: boolean
    direction?: "vertical"
}
export default function BackgroundImageSlider({ images = [img1.src, img2.src, img3.src], zIndex = 0, bgDark, direction }: Props) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(x => x === images.length - 1 ? 0 : x + 1)
        }, 2e3);
        return () => clearInterval(interval);
    }, []);

    function getDirection(state: boolean) {
        if (direction === 'vertical') return state ? "left" : "right"
        return state ? "down" : "up"
    }
    return <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex
    }}>
        {
            images.map((x, i) => <Slide in={step === i} key={x} direction={getDirection(step === i)}>
                <Box
                    component="img"
                    src={x}
                    alt="bg"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                        objectFit: 'cover',
                        height: '100%',
                        width: '100%'
                    }}
                />
            </Slide>)
        }
        {
            bgDark ?
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    bgcolor: 'background.paper',
                    opacity: .5
                }} /> :
                <Box sx={theme => ({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    opacity: .7
                })} />
        }
    </Box>
}