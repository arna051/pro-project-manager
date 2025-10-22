import { AddToolProps } from "easy-llm-call";
import { actions } from "../actions";
import { getProjects } from "@next/api/projects";

export const entity_fetch_tools: AddToolProps[] = [
    {
        ...actions.get_projects,
        func: async () => JSON.stringify(await getProjects()),
    },
    {
        ...actions.get_categories,
        func: async () => JSON.stringify(await window.electron.db.find("Category"))
    },
    {
        ...actions.get_servers,
        func: async () => JSON.stringify(await window.electron.db.find("Server"))
    },
    {
        ...actions.get_repos,
        func: async () => JSON.stringify(await window.electron.db.find("Repo"))
    },
    {
        ...actions.get_reminders,
        func: async () => JSON.stringify(await window.electron.db.find("Category"))
    },
]