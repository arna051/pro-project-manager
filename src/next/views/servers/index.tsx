import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import ServersHero from "./components/hero";
import SearchBox from "@next/components/search";
import { IServer } from "@electron/model/server";
import { toast } from "sonner";
import ServersTable from "./components/table";

export default function ServersView() {
    const [search, setSearch] = useState('');
    const [servers, setServers] = useState<IServer[]>([]);

    const load = () => {
        window
            .electron
            .db
            .find("Server")
            .then(setServers)
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load servers!"))
    }


    function onDelete(id: string) {
        window.electron.db.remove("Server", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    const filtered = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return servers.filter(x => regex.test(x.title) || regex.test(x.host) || regex.test(x.user))
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

        <ServersHero />

        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <SearchBox
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </Stack>

        <ServersTable
            servers={filtered}
            onDelete={onDelete}
        />
    </Box>
}