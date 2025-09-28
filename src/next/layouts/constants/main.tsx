import { NavItem } from "layouts/components/type";
import { ContractorsIcon, DashboardIcon, ProjectIcon, RepoIcon, ServerIcon } from "components/icons";

export const MainNav: NavItem[] = [
    {
        href: "/dashboard",
        icon: <DashboardIcon />,
        primary: "Dashboard",
        secondary: "Manage all at once"
    },
    {
        href: "/projects",
        icon: <ProjectIcon />,
        primary: "Projects",
        secondary: "Contracts & projects"
    },
    {
        href: "/repos",
        icon: <RepoIcon />,
        primary: "Repositories",
        secondary: "Check Your repositories"
    },
    {
        href: "/servers",
        icon: <ServerIcon />,
        primary: "Servers",
        secondary: "Server management"
    },
    {
        href: "/contractors",
        icon: <ContractorsIcon />,
        primary: "Contractors",
        secondary: "your customers & partners"
    }
]

