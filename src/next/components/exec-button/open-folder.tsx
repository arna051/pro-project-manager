import { IconButton } from "@mui/material"
import { FolderIcon } from "../icons"
import { toast } from "sonner"
import { SETTINGS } from "@next/constants/settings"

type Props = {
    path: string
    size?: number
}
export function OpenFolder({ path, size = 18 }: Props) {

    async function handleOpenFolder() {
        try {
            const setting = await window.electron.db.doc("Setting", [
                {
                    $match: {
                        key: SETTINGS.fileBrowser
                    }
                }
            ]);

            if (!setting) return toast.warning("first config file browser in the settings page.");

            const bash = await window.electron.terminal.createBash(setting.value.replace("$1", path));

            await window.electron.terminal.execute(bash);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot open folder.")
        }
    }

    return <IconButton onClick={handleOpenFolder}>
        <FolderIcon width={size} height={size} />
    </IconButton>
}