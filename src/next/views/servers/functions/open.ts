import { AddToolProps } from "easy-llm-call";
import { actions } from "../actions";
import { useTerminal } from "@next/terminal";
import { SETTINGS } from "@next/constants/settings";

export const open_tools: AddToolProps[] = [
    {
        ...actions.open_browser,
        props: {
            url: {
                type: 'string',
                desc: 'the url you want to open for the user',
                required: true
            }
        },
        func: async ({ url }) => {

            const setting = await window.electron.db.doc("Setting", [
                {
                    $match: {
                        key: SETTINGS.internetBrowser
                    }
                }
            ]);


            if (setting) window.electron.terminal.execute(setting.value.replace("$1", url))
            else window.electron.terminal.execute(`firefox "${url}"`);

            return "OK"
        },
    },
    {
        ...actions.open_file_select_dialog,
        func: async () => {

            const res = await window.electron.dialog.openFile({ properties: ["multiSelections", "openFile", "showHiddenFiles"] })

            if (res.canceled)
                return "cancelled"

            return JSON.stringify(res.filePaths || "[]") || []
        },
    },
    {
        ...actions.open_folder_select_dialog,
        func: async () => {

            const res = await window.electron.dialog.openFile({ properties: ["multiSelections", "openDirectory", "showHiddenFiles"] })

            if (res.canceled)
                return "cancelled"

            return JSON.stringify(res.filePaths || "[]") || []
        },
    },
    {
        ...actions.confirm,
        props: {
            message: {
                type: 'string',
                desc: 'the confirmation message.',
                required: true
            }
        },
        func: async ({ message }) => {

            const res = await window.electron.dialog.confirm(message)
            return res ? "OK" : "cancelled"
        },
    },
]

export function useTerminalTool(register: (name: string, opt: Omit<AddToolProps, "name">) => any) {
    const { create } = useTerminal()

    register(actions.execute_command_on_user_terminal.name, {
        ...actions.execute_command_on_user_terminal,
        props: {
            command: {
                desc: "the command you want to run on user's terminal",
                required: true,
                type: 'string'
            }
        },
        func: async ({ command }) => {
            create("AI", command);
            return "created"
        },
    })
}