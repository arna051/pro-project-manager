import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import RepoHero from "./components/hero";
import SearchBox from "@next/components/search";
import { toast } from "sonner";
import ReposTable from "./components/table";
import { IRepo } from "@electron/model/repo";

export default function RepositoriesView() {
    const [search, setSearch] = useState('');
    const [repos, setRepos] = useState<IRepo[]>([]);

    const load = () => {
        window
            .electron
            .db
            .list("Repo", [
                {
                    $lookup: {
                        as: "project",
                        from: "projects",
                        foreignField: "_id",
                        localField: "projectId"
                    }
                },
                {
                    $set: {
                        project: { $arrayElemAt: ['$project', 0] }
                    }
                }
            ])
            .then((res: IRepo[]) => setRepos(res.sort((a, b) => new Date(b.project?.lastCheck || "").getTime() - new Date(a.project?.lastCheck || "").getTime())))
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load repos!"))
    }


    function onDelete(id: string) {
        window.electron.db.remove("Repo", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    const filtered = useMemo(() => {
        const regex = new RegExp(search, 'i');
        return repos.filter(x => regex.test(x.title) || (!!x.project && regex.test(x.project?.title)))
    }, [repos, search])


    useEffect(load, [])
    return <Box
        sx={{
            p: 2,
            pt: 6,
            position: 'relative'
        }}
    >

        <BGFade height={800} opacity={.8} />

        <RepoHero />

        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
            <SearchBox
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </Stack>

        <ReposTable
            repos={filtered}
            onDelete={onDelete}
        />
    </Box>
}