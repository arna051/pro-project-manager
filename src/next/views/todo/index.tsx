import { Box } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import TodoHero from "./components/hero";
import { getProjects } from "@next/api/projects";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Data } from "./type";
import Timeline from "./components/timeline";


export default function TodosView() {

    const [data, setData] = useState<Data[]>([]);

    function load() {
        getProjects()
            .then(res => {
                const todos: Data[] = []
                res.forEach(x => {
                    x.todos.forEach(y => {
                        const row = {
                            task: y.task,
                            priority: y.priority,
                            projectId: x._id as string,
                            projectTitle: x.title,
                            date: new Date(y.date).getTime(),
                            done: !!y.done
                        }
                        const index = todos.findIndex(c => c.date === row.date);

                        if (!todos[index]) return todos.push({
                            date: row.date,
                            data: [row]
                        })

                        todos[index].data.push(row)
                    })
                });

                setData(todos.sort((a, b) => b.date - a.date))
            })
            .catch(err =>
                toast.error(err instanceof Error ? err.message : err)
            )
    };

    useEffect(load, [])

    return <Box sx={{ position: 'relative' }}>
        <BGFade height={800} />
        <Box sx={{ p: 2, pt: 6 }}>
            <TodoHero />

            <Timeline data={data} />
        </Box>
    </Box>
}