import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import BashHero from "./components/hero";
import SearchBox from "@next/components/search";
import { IBashScript } from "@electron/model/bashscript";
import { toast } from "sonner";
import BashTable from "./components/table";

export default function BashView() {
    const [search, setSearch] = useState('');
    const [servers, setServers] = useState<IBashScript[]>([]);

    const load = () => {
        window
            .electron
            .db
            .find("BashScript")
            .then(setServers)
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load servers!"))
    }


    function onDelete(id: string) {
        window.electron.db.remove("BashScript", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const button = target.closest("button[data-id]") as HTMLButtonElement | null;

        if (button) {
            const id = button.dataset.id;
            if (!id) return
            onDelete(id)
        }
    };

    const filtered = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return servers.filter(x => regex.test(x.title) || regex.test(x.script) || regex.test(x.description))
    }, [servers, search])


    useEffect(load, [])
    return <Box
        sx={{
            p: 2,
            pt: 6,
            position: 'relative'
        }}
    >

        <BGFade height={800} opacity={.8} />

        <BashHero />

        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <SearchBox
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </Stack>

        <Box component="div" onClick={handleClick}>
            <BashTable
                scripts={filtered}
            />
        </Box>
    </Box>
}