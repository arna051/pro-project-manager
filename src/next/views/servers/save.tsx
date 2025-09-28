import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, Grid, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import Hero from "@next/components/hero";
import { Field, Form } from "@next/components/hook-form";
import { SaveIcon, ServerIcon } from "@next/components/icons";
import { ServerSchema } from "@next/validation/server";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FakeServerTerminal from "./components/fake-commands";


const initial = {
    host: '',
    user: '',
    password: '',
    port: '22',
    title: ''
}

export default function ServerSave() {
    const params = useSearchParams();
    const router = useRouter();

    const id = params.get("id");

    const projectId = params.get("projectId")

    const methods = useForm<any>({
        resolver: zodResolver(ServerSchema),
        defaultValues: initial,
    });

    const {
        handleSubmit,
        setValue,
        reset,
        watch
    } = methods;

    const { user, host, port } = watch()

    const onSubmit = handleSubmit(data => {
        if (id) return window
            .electron
            .db
            .update("Server", { _id: id }, { $set: data })
            .then((res) => {
                toast.success("Server was saved!")
                router.push(projectId ? `/servers?projectId=${projectId}` : "/servers");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })

        window
            .electron
            .db
            .save("Server", data)
            .then((res) => {
                toast.success("Server was saved!")
                router.push(projectId ? `/servers?projectId=${projectId}` : "/servers");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })
    })


    useEffect(() => {
        if (!id) return
        window.electron.db.doc("Server", [{ $match: { _id: id } }])
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
                icon={ServerIcon}
                title="Save Server"
                subtitle="Save your remote system login info"
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
                                <Field.Text name="title" label="Server Name" />
                                <Field.Text name="user" label="Username" />
                                <Field.Text name="host" label="Host" />
                                <Field.Text name="password" label="Password" type="password" />
                                <Field.Text name="port" label="SSH port" />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ my: 2 }} className="glassy">
                        <CardContent>
                            $ ssh {user || "root"}@{host || "127.0.0.1"} -p {port || "22"}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <FakeServerTerminal />
                </Grid>
            </Grid>
        </Form>
    </Box>
}