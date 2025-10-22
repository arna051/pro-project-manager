import { AddToolProps } from "easy-llm-call";
import { actions } from "../actions";
import { ProjectSchema } from "@next/validation/project";
import { ServerSchema } from "@next/validation/server";
import { RepoSchema } from "@next/validation/repo";
import { CategorySchema } from "@next/validation/category";
import { ContractorSchema } from "@next/validation/contractor";

export const save_tools: AddToolProps[] = [
    {
        ...actions.save_entity,
        props: {
            type: {
                type: "string",
                desc: "the type of entity, it must be one of: Project, Server, Repo, Category, Contractor",
                required: true,
            },
            entity: {
                type: "string",
                desc: "json string of the entity.",
                required: true
            },
            entityId: {
                type: "string",
                desc: "the entityId you want to update. hex string. let it empty if you want to create a new entity.",
                required: false
            }
        },
        func: async ({ type, entity, entityId }) => {
            let object: any = JSON.parse(entity);

            switch (type) {
                case "Project": {
                    object.imageId = '10313'
                    const { data, error, success } = entityId ? ProjectSchema.partial().safeParse(object) : ProjectSchema.safeParse(object);
                    if (!success) return JSON.stringify(error);
                    object = data
                    break;
                }
                case "Server": {
                    const { data, error, success } = entityId ? ServerSchema.partial().safeParse(object) : ServerSchema.safeParse(object);
                    if (!success) return JSON.stringify(error);
                    object = data
                    break;
                }
                case "Repo": {
                    const { data, error, success } = entityId ? RepoSchema.partial().safeParse(object) : RepoSchema.safeParse(object);
                    if (!success) return JSON.stringify(error);
                    object = data
                    break;
                }
                case "Category": {
                    const { data, error, success } = entityId ? CategorySchema.partial().safeParse(object) : CategorySchema.safeParse(object);
                    if (!success) return JSON.stringify(error);
                    object = data
                    break;
                }
                case "Contractor": {
                    const { data, error, success } = entityId ? ContractorSchema.partial().safeParse(object) : ContractorSchema.safeParse(object);
                    if (!success) return JSON.stringify(error);
                    object = data
                    break;
                }

                default: return "wrong type. it must be one of: Project, Server, Repo, Category, Contractor"
            }

            const result = entityId ?
                await window.electron.db.update(type, { _id: entityId }, { $set: object }) :
                await window.electron.db.save(type, object);

            try {
                return JSON.stringify(result || { status: "OK" })
            }
            catch {
                return result || "Saved"
            }
        },
    },
    {
        ...actions.add_reminder,
        props: {
            reminder: {
                type: "string",
                desc: "json string of the reminder. {title: string, content: string, deadline: string}. deadline is timestamp as number",
                required: true
            }
        },
        func: async ({ reminder }) => {
            reminder = JSON.parse(reminder)
            const obj = {
                ...reminder,
                deadline: new Date(reminder.deadline).getTime()
            }

            const result = await window.electron.db.save("Reminder", obj);

            try {
                return JSON.stringify(result || { status: "OK" })
            }
            catch {
                return result || "Saved"
            }
        }
    },
    {
        ...actions.remove_reminder,
        props: {
            id: {
                type: "string",
                desc: "the hex string id of the reminder you want to delete",
                required: true
            }
        },
        func: async ({ id }) => {
            const result = await window.electron.db.remove("Reminder", { _id: id });

            try {
                return JSON.stringify(result || { status: "OK" })
            }
            catch {
                return result || "Deleted"
            }
        }
    }
]