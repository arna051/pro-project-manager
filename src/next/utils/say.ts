import { toast } from "sonner";
import { v4 } from "uuid";

export default function say(content: string) {
    try {
        const name = v4();
        window.electron.terminal.execute(`pico2wave -w /tmp/${name}.wav "${content}" && aplay /tmp/${name}.wav`)
    }
    catch (err) {
        toast.warning(err instanceof Error ? err.message : "Cannot make Text to speech. you need to install pico2wave")
    }
}