"use client"
import { Button } from "@mui/material";
import Hero from "@next/components/hero";
import { GitIcon, RepoIcon } from "@next/components/icons";


export default function RepoHero() {
    async function sync() {
        const elements = window.document.querySelectorAll<HTMLLinkElement>("a.git-button");
        const btns = Array.from(elements);

        for (let index = 0; index < btns.length; index++) {
            const b = btns[index];
            b.click();
            await new Promise(res => setTimeout(res, 2e3))
        }
    }
    return <Hero
        icon={RepoIcon}
        title="Repositories"
        subtitle="Code Repositories & Projects Parts"
        button={{
            text: "New Repo",
            href: "/repos/save",
        }}

        actions={<Button color="primary" variant="contained" startIcon={<GitIcon />} children="Sync" title="push all changes to remote" onClick={sync} />}
    />
}