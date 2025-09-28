import { IContractor } from "@electron/model/contractor";
import { Box, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import SearchBox from "@next/components/search";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ContractorsHero from "./components/hero";
import ContractorItems from "./components/items";

export default function ContractorsView() {
    const [search, setSearch] = useState('');
    const [servers, setServers] = useState<IContractor[]>([]);

    const load = () => {
        window
            .electron
            .db
            .find("Contractor")
            .then(setServers)
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load servers!"))
    }


    function onDelete(id: string) {
        window.electron.db.remove("Contractor", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    const filtered = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return servers.filter(x => regex.test(x.name))
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

        <ContractorsHero />

        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <SearchBox
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </Stack>

        <ContractorItems
            contractors={filtered}
            onDelete={onDelete}
        />
    </Box>
}