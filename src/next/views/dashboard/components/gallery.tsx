import { Button, Card, CardActions, CardHeader } from "@mui/material";
import { GalleryIcon, SeeMoreIcon } from "components/icons";
import BackgroundImageSlider from "components/slider";
import img1 from "assets/ChatGPT Image May 2, 2025, 01_32_29 AM.png";
import img2 from "assets/May 2, 2025, 01_28_54 AM.png";
import img3 from "assets/May 2, 2025, 01_28_55 AM.png";

export default function GalleryWight() {
    return <Card
        sx={{
            position: 'relative',
            height: '100%'
        }}
    >
        <BackgroundImageSlider
            bgDark
            direction="vertical"
            images={[
                img1.src,
                img2.src,
                img3.src
            ]}
        />

        <CardHeader
            avatar={<GalleryIcon />}
            title="Gallery"
            subheader="Recent uploaded images."
            sx={{ position: 'relative' }}
        />

        <CardActions sx={{
            position: 'absolute', bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'end'
        }}>
            <Button
                startIcon={<SeeMoreIcon />}
                size="small"
            >
                See More
            </Button>
        </CardActions>
    </Card>
}