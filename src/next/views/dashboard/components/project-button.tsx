import { Button, Typography } from "@mui/material";
import { ProjectIcon } from "components/icons";
import BackgroundImageSlider from "components/slider";
import Link from "next/link";

export default function ProjectsButton() {

    return <Button
        LinkComponent={Link}
        href="/projects"
        sx={{
            height: 200,
            width: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.primary',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <BackgroundImageSlider zIndex={-1} bgDark />
        <ProjectIcon width={50} height={50} />
        <Typography variant="subtitle1" fontWeight="bold">Projects</Typography>
    </Button>
}