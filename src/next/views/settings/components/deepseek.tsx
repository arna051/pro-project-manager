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
    API_KEY: z.string(),
})

export default function DeepseekSettings() {
    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            API_KEY: ''
        }
    })

    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            if (data.id)
                await window.electron.db.update("Setting", { _id: data.id }, { $set: { value: data.API_KEY } })
            else await window.electron.db.save("Setting", { key: SETTINGS.deepseek, value: data.API_KEY });

            toast.success("Deepseek settings saved!")
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot load API_KEY config")
        }
    });

    useEffect(() => {
        (async () => {
            const data = await window.electron.db.doc("Setting", [
                {
                    $match: { key: SETTINGS.deepseek }
                }
            ]);

            if (!data) return;

            methods.setValue("id", data._id)
            methods.setValue("API_KEY", data.value)
        })()
    }, [])
    return <Box sx={{ my: 4 }}>
        <Stack gap={1}>
            <Typography variant="body2" fontWeight="bold">
                Deepseek API key:
            </Typography>
            <Form methods={methods} onSubmit={onSubmit}>
                <RHFSingle name="API_KEY" icon={<TerminalIcon />} />
            </Form>
        </Stack>
    </Box>
}