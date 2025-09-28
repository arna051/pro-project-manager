"use client"
import Hero from "@next/components/hero";
import { ServerIcon } from "components/icons";
import { useSearchParams } from "next/navigation";


export default function ServersHero() {
    const params = useSearchParams();
    const projectId = params.get("projectId");
    return <Hero
        icon={ServerIcon}
        title="Servers"
        subtitle="SSH connections & remote servers"
        button={{
            text: "New Server",
            href: projectId ? `/servers/save?projectId=${projectId}` : "/servers/save",
        }}

    />
}