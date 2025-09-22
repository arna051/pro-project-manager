import { SettingIcon } from "components/icons";
import { NavItem } from "layouts/components/type";

export const OthersNav: NavItem[] = [
    {
        href: "/settings",
        icon: <SettingIcon />,
        primary: "Settings",
        secondary: "App & Account Configuration"
    },
]