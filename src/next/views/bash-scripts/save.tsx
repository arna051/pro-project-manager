import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, Grid, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import Hero from "@next/components/hero";
import { Field, Form } from "@next/components/hook-form";
import { BashIcon, SaveIcon } from "@next/components/icons";
import { BashScriptSchema } from "@next/validation/bashscript";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


const initial = {
    title: '',
    description: '',
    script: '# write your script here!\ncd ~;\nls -a'
}

export default function BashSave() {
    const params = useSearchParams();
    const router = useRouter();

    const id = params.get("id");

    const methods = useForm<any>({
        resolver: zodResolver(BashScriptSchema),
        defaultValues: initial,
    });

    const {
        handleSubmit,
        setValue,
        reset,
    } = methods;


    const onSubmit = handleSubmit(data => {
        if (id) return window
            .electron
            .db
            .update("BashScript", { _id: id }, { $set: data })
            .then(() => {
                toast.success("BashScript was saved!")
                router.push("/bash-scripts");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })

        window
            .electron
            .db
            .save("BashScript", data)
            .then(() => {
                toast.success("BashScript was saved!")
                router.push("/bash-scripts");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })
    })


    useEffect(() => {
        if (!id) return
        window.electron.db.doc("BashScript", [{ $match: { _id: id } }])
            .then(res => {
                if (!res) return;
                Object.keys(initial).forEach(key => {
                    setValue(key, res[key])
                })
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            });
    }, [id]);


    return <Box
        sx={{
            p: 2,
            pt: 6,
            position: 'relative'
        }}>
        <Form methods={methods} onSubmit={onSubmit}>
            <BGFade height={800} />
            <Hero
                icon={BashIcon}
                title="Save Script"
                subtitle="Save your bash script to storage"
                button={{
                    text: "Save",
                    icon: <SaveIcon />
                }}
                reset={reset}
            />

            <Grid container spacing={2} sx={{ position: 'relative', my: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="glassy">
                        <CardContent>
                            <Stack
                                gap={2}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Field.Text name="title" label="Bash Script Name" />
                                <Field.Editor name="description" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Field.Code name="script" height={400} />
                </Grid>
            </Grid>
        </Form>
    </Box>
}