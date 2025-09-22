import { FSIcon, GalleryIcon, } from "components/icons";
import { NavItem } from "layouts/components/type";

export const FsNav: NavItem[] = [
    {
        href: "/gallery",
        icon: <GalleryIcon />,
        primary: "Gallery",
        secondary: "Your images & categories"
    },
    {
        href: "/file-system",
        icon: <FSIcon />,
        primary: "File System",
        secondary: "cloud files and folders"
    },
]