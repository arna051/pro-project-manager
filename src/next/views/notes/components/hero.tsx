"use client"
import Hero from "@next/components/hero";
import { NoteIcon } from "components/icons";


export default function NotesHero() {
    return <Hero
        icon={NoteIcon}
        title="Notes"
        subtitle="Documents & common used information"
        button={{
            text: "New Note",
            href: "/notes/save",
        }}

    />
}