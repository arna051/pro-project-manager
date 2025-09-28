import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import { Form } from "@next/components/hook-form";
import { useForm } from "react-hook-form";
import z from "zod";
import RHFSingle from "./rhf";
import { toast } from "sonner";
import { useEffect } from "react";
import { SETTINGS } from "@next/constants/settings";
import { TerminalIcon } from "@next/components/icons";

const schema = z.object({
    id: z.string().optional(),
    command: z.string(),
})

export default function TerminalProxiedSettings() {
    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            command: 'gnome-terminal -- bash -c "$1"'
        }
    })

    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            if (data.id)
                await window.electron.db.update("Setting", { _id: data.id }, { $set: { value: data.command } })
            else await window.electron.db.save("Setting", { key: SETTINGS.proxyTerminal, value: data.command });

            toast.success("Terminal settings saved!")
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot load command config")
        }
    });

    useEffect(() => {
        (async () => {
            const data = await window.electron.db.doc("Setting", [
                {
                    $match: { key: SETTINGS.proxyTerminal }
                }
            ]);

            if (!data) return;

            methods.setValue("id", data._id)
            methods.setValue("command", data.value)
        })()
    }, [])
    return <Box sx={{ my: 4 }}>
        <Stack gap={1}>
            <Typography variant="body2" fontWeight="bold">
                Proxied Terminal lunch command:
            </Typography>
            <Form methods={methods} onSubmit={onSubmit}>
                <RHFSingle name="command" icon={<TerminalIcon />} />
            </Form>
            <Typography variant="caption" color="text.secondary" >
                the command you put in here must include "$1" variable to let app pass command to your terminal
            </Typography>
        </Stack>
    </Box>
}