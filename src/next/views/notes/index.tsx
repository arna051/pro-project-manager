import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import NotesHero from "./components/hero";
import SearchBox from "@next/components/search";
import { toast } from "sonner";
import NotesTable from "./components/table";
import { INote } from "@electron/model/note";

export default function NotesView() {
    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState<INote[]>([]);

    const load = () => {
        window
            .electron
            .db
            .find("Note")
            .then(setNotes)
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load notes!"))
    }


    function onDelete(id: string) {
        window.electron.db.remove("Server", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    const filtered = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return notes.filter(x => regex.test(x.title))
    }, [notes, search])


    useEffect(load, [])
    return <Box
        sx={{
            p: 2,
            pt: 6,
            position: 'relative'
        }}
    >

        <BGFade height={800} opacity={.8} />

        <NotesHero />

        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <SearchBox
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </Stack>

        <NotesTable
            notes={filtered}
            onDelete={onDelete}
        />
    </Box>
}