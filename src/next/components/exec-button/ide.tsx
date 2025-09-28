import { IconButton } from "@mui/material";
import { SETTINGS } from "@next/constants/settings";
import { toast } from "sonner";
import { VscodeIcon } from "../icons";

type Props = {
    path: string
    size?: number
}
export function IDEButton({ path, size = 18 }: Props) {

    async function handleOpenFolder() {
        try {
            const setting = await window.electron.db.doc("Setting", [
                {
                    $match: {
                        key: SETTINGS.ide
                    }
                }
            ]);

            if (!setting) return toast.warning("first config file IDE in the settings page.");

            const bash = await window.electron.terminal.createBash(setting.value.replace("$1", path));

            await window.electron.terminal.execute(bash);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot open IDE.")
        }
    }

    return <IconButton onClick={handleOpenFolder}>
        <VscodeIcon width={size} height={size} />
    </IconButton>
}