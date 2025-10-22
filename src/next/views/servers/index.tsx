import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Fade, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import ServersHero from "./components/hero";
import SearchBox from "@next/components/search";
import { IServer } from "@electron/model/server";
import { toast } from "sonner";
import ServersTable from "./components/table";
import { ConfigIcon } from "@next/components/icons";
import Link from "next/link";

export default function ServersView() {
    const [search, setSearch] = useState('');
    const [servers, setServers] = useState<IServer[]>([]);

    const [config, setConfig] = useState<string[]>([])

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
    function onConfig(id: string) {
        if (config.some(x => x === id)) return setConfig(last => last.filter(x => x !== id));
        setConfig(last => [...last, id])
    }

    const filtered = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return servers.filter(x => regex.test(x.title) || regex.test(x.host) || regex.test(x.user))
    }, [servers, search]);

    const selected: IServer[] = useMemo(() => {
        return config.map(x => servers.find(c => c._id.toString() === x)).filter(Boolean) as IServer[]
    }, [config.length])


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
        <Fade in={!!config.length}>
            <Box sx={{ position: 'relative', maxWidth: '95%', mx: 'auto', mb: 2 }}>
                <Stack direction="row" alignItems="center" gap={2}>
                    <Stack direction="row" flexWrap="wrap" gap={.5}>
                        {
                            selected.map(x => <Chip label={x.title} key={x._id.toString()} />)
                        }
                    </Stack>
                    <Divider sx={{ flex: '1 1 auto' }} />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ConfigIcon />}
                        LinkComponent={Link}
                        href={`/servers/config?${config.map(x => `id=${x}`).join("&")}`}>
                        Go Config
                    </Button>
                </Stack>
            </Box>
        </Fade>
        <ServersTable
            servers={filtered}
            onDelete={onDelete}
            onConfig={onConfig}
        />
    </Box>
}