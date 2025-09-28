"use client"
import Hero from "@next/components/hero";
import { BashIcon } from "components/icons";


export default function ServersHero() {
    return <Hero
        icon={BashIcon}
        title="Bash Storage"
        subtitle="Saved bash scripts are listed here"
        button={{
            text: "New Script",
            href: "/bash-scripts/save",
        }}

    />
}