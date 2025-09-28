"use client";

import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Tooltip, Typography } from "@mui/material";
import { ApiIcon, PersonalIcon } from "components/icons/api";
import Link from "next/link";
import { ReactNode } from "react";
import { NavItem } from "./type";
import { MainNav } from "layouts/constants/main";
import { usePathname } from "next/navigation";
import { SecondaryNav } from "layouts/constants/personal";
import { InfoIcon } from "components/icons";
import { OthersNav } from "layouts/constants/other";

export default function Drawer({ flat }: { flat: boolean }) {
    return <Stack sx={{ width: '100%', mt: flat ? 6 : 0 }}>
        <Section
            icon={<ApiIcon width={18} height={18} />}
            title="Engineering"
            flat={flat}
        >
            {
                MainNav.map(item => flat ? <SectionLinkFlat item={item} key={item.href} /> : <SectionLink item={item} key={item.href} />)
            }
        </Section>
        <Section
            icon={<PersonalIcon width={18} height={18} />}
            title="Personal"
            flat={flat}
        >
            {
                SecondaryNav.map(item => flat ? <SectionLinkFlat item={item} key={item.href} /> : <SectionLink item={item} key={item.href} />)
            }
        </Section>
        <Section
            icon={<InfoIcon width={18} height={18} />}
            title="Other"
            flat={flat}
        >
            {
                OthersNav.map(item => flat ? <SectionLinkFlat item={item} key={item.href} /> : <SectionLink item={item} key={item.href} />)
            }
        </Section>
    </Stack>
}

function Section({ children, title, icon, flat }: { title: string, icon: ReactNode, flat: boolean } & ChildProp) {

    return <Box>
        {!flat && <Stack direction="row" gap={2} sx={{ mx: 1 }}>
            {icon}
            <Typography variant="caption" color="text.secondary">
                {title}
            </Typography>
        </Stack>}
        <List>
            {children}
        </List>
    </Box>
}


function SectionLink({ item: { href, icon, primary, secondary } }: { item: NavItem }) {
    const pathname = usePathname();
    const path = pathname.includes("?") ? pathname.split("?")[0] : pathname;

    const isActive = new RegExp(href, 'i').test(path);

    return <ListItem sx={theme => ({
        p: 0,
        background: isActive ? `linear-gradient(90deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : "transparent"
    })}>
        <ListItemButton LinkComponent={Link} href={href} >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={primary}
                secondary={secondary}
            />
        </ListItemButton>
    </ListItem>
}
function SectionLinkFlat({ item: { href, icon, primary } }: { item: NavItem }) {
    const pathname = usePathname();
    const path = pathname.includes("?") ? pathname.split("?")[0] : pathname;

    const isActive = new RegExp(href, 'i').test(path);

    return <Tooltip title={primary}>
        <IconButton
            LinkComponent={Link}
            href={href}
            sx={theme => ({
                display: 'block',
                borderRadius: 0,
                background: isActive ? `linear-gradient(90deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : "transparent"
            })}>
            {icon}
        </IconButton>
    </Tooltip>
}