"use client"
import Hero from "@next/components/hero";
import { RepoIcon } from "@next/components/icons";


export default function RepoHero() {
    return <Hero
        icon={RepoIcon}
        title="Repositories"
        subtitle="Code Repositories & Projects Parts"
        button={{
            text: "New Repo",
            href: "/repos/save",
        }}

    />
}