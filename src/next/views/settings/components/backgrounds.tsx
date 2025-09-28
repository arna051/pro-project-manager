import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Field, Form } from "@next/components/hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { SETTINGS } from "@next/constants/settings";
import { AddIcon, SaveIcon } from "@next/components/icons";
import GradientButton from "@next/components/gradient-button";

const schema = z.object({
    images: z.array(z.string()),
})

export default function BackgroundSettings() {
    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            images: localStorage.getItem(SETTINGS.backgrounds) ? JSON.parse(localStorage.getItem(SETTINGS.backgrounds) || "[]") : []
        }
    })

    const { fields, append } = useFieldArray({
        name: "images",
        control: methods.control,
    })

    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            const string = JSON.stringify(data.images.filter(Boolean));
            localStorage.setItem(SETTINGS.backgrounds, string);
            toast.success("Background settings saved!")
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot load bg config")
        }
    });


    return <Box sx={{ my: 4 }}>
        <Stack gap={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" >
                <Typography variant="body2" fontWeight="bold">
                    Slide Fade Backgrounds:
                </Typography>

                <Stack direction="row" gap={1}>
                    <GradientButton size="small" startIcon={<AddIcon />} onClick={() => append("")}>
                        Append Image
                    </GradientButton>
                    <GradientButton size="small" startIcon={<SaveIcon />} onClick={() => onSubmit()}>
                        Save
                    </GradientButton>
                </Stack>
            </Stack>
            <Form methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={1}>
                    {
                        fields.map((_, i) => <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Field.Image name={`images.${i}`} />
                        </Grid>)
                    }
                </Grid>
            </Form>
        </Stack>
    </Box>
}