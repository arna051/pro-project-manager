import { AddToolProps } from "easy-llm-call";
import { actions } from "../actions";

export const time_tools: AddToolProps[] = [
    {
        ...actions.get_current_time,
        func: async () => JSON.stringify({
            iso: new Date().toISOString(),
            system: new Date().toString()
        }),
    },
]