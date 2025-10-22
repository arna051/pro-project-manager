"use client";
import { Box, Fade } from "@mui/material";
import img1 from "../../assets/1358310.png";
import img2 from "../../assets/coder-programming-computer-screen-computer.jpg";
import img3 from "../../assets/coding-background-9izlympnd0ovmpli.jpg";
import { useEffect, useState } from "react";
import { SETTINGS } from "@next/constants/settings";
import { FsAvatar } from "../avatar";


type Props = {
    height: string | number

    images?: string[]

    opacity?: number

    isNotFs?: boolean
}

function loadImages() {
    if (typeof window === 'undefined') return [img1.src, img2.src, img3.src]
    const images = localStorage.getItem(SETTINGS.backgrounds) ? JSON.parse(localStorage.getItem(SETTINGS.backgrounds) || "[]") : [];
    return images.length ? images : [img1.src, img2.src, img3.src]
}
export default function BGFade({ height, images = loadImages(), opacity = .7, isNotFs }: Props) {
    const [step, setStep] = useState(images.length - 1);


    function isFsGrid() {
        if (isNotFs) return false;
        if (typeof window === 'undefined') return false
        const images = localStorage.getItem(SETTINGS.backgrounds) ? JSON.parse(localStorage.getItem(SETTINGS.backgrounds) || "[]") : [];
        return !!images.length
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setStep(x => x === images.length - 1 ? 0 : x + 1)
        }, 3e3);
        return () => clearInterval(interval);
    }, [])
    return <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 0,
        height,
        maskImage: 'linear-gradient(to top, transparent 10%, black 100%)'
    }}>
        {
            images.map((x, i) => <Fade in={step === i} key={x} timeout={1e3}>
                <Box
                    component={isFsGrid() ? FsAvatar : "img"}
                    variant="square"
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
            </Fade>)
        }
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            opacity,
            bgcolor: 'background.paper'
        }} />
    </Box>
}