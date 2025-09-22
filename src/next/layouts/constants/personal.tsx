import { BashIcon, NoteIcon, TodoIcon } from "components/icons";
import { NavItem } from "layouts/components/type";

export const SecondaryNav: NavItem[] = [
    {
        href: "/todo",
        icon: <TodoIcon />,
        primary: "To do",
        secondary: "See what you have to do."
    },
    {
        href: "/notes",
        icon: <NoteIcon />,
        primary: "Notes",
        secondary: "Saved documents & messages."
    },
    {
        href: "/bash-scripts",
        icon: <BashIcon />,
        primary: "Bash Scripts",
        secondary: "Bash script templates."
    },
]