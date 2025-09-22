"use client";
import { Box, Fade } from "@mui/material";
import img1 from "../../assets/1358310.png";
import img2 from "../../assets/coder-programming-computer-screen-computer.jpg";
import img3 from "../../assets/coding-background-9izlympnd0ovmpli.jpg";
import { useEffect, useState } from "react";


type Props = {
    height: string | number

    images?: string[]
}
export default function BGFade({ height, images = [img1.src, img2.src, img3.src] }: Props) {
    const [step, setStep] = useState(images.length - 1);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(x => x === images.length - 1 ? 0 : x + 1)
        }, 2e3);
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
            </Fade>)
        }
        <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            opacity: .5,
            bgcolor: 'background.paper'
        }} />
    </Box>
}