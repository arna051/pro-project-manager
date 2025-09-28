import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Card, CardContent, CardHeader, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import Hero from "@next/components/hero";
import { Field, Form } from "@next/components/hook-form";
import { AddIcon, DeleteIcon, FleshRightIcon, ListIcon, NoteIcon, SaveIcon, SeeMoreIcon } from "@next/components/icons";
import { NoteSchema } from "@next/validation/note";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";


const initial = {
    title: '',
    content: [],
}

export default function NoteSave() {
    const params = useSearchParams();
    const router = useRouter();

    const id = params.get("id");

    const methods = useForm<any>({
        resolver: zodResolver(NoteSchema),
        defaultValues: initial,
    });

    const {
        handleSubmit,
        setValue,
        reset,
        control,
        watch
    } = methods;

    const { remove, append, fields: content } = useFieldArray({
        control,
        name: "content"
    })

    const onSubmit = handleSubmit(data => {
        if (id) return window
            .electron
            .db
            .update("Note", { _id: id }, { $set: data })
            .then(() => {
                toast.success("Note was saved!")
                router.push("/notes");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })

        window
            .electron
            .db
            .save("Note", data)
            .then(() => {
                toast.success("Note was saved!")
                router.push("/notes");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })
    })


    useEffect(() => {
        if (!id) return
        window.electron.db.doc("Note", [{ $match: { _id: id } }])
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
                icon={NoteIcon}
                title="Save Note"
                subtitle="Craft a new document or save a note"
                button={{
                    text: "Save",
                    icon: <SaveIcon />
                }}
                reset={reset}
            />

            <Grid container spacing={2} sx={{ position: 'relative', my: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card className="glassy">
                        <CardHeader
                            title="Describe"
                            subheader="describe the whole document or note"
                            avatar={<NoteIcon />}
                        />
                        <CardContent>
                            <Stack
                                gap={2}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Field.Text name="title" label="Note Title" />
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card sx={{ my: 2 }} className="glassy">
                        <CardHeader
                            title="Append Section"
                            subheader="Add a section to document"
                            avatar={<ListIcon />}
                            action={<IconButton onClick={() => append({ title: '', content: '' })}>
                                <AddIcon></AddIcon>
                            </IconButton>}
                        />
                    </Card>

                    {
                        useMemo(() => content.map((_, i) => <Card sx={{ my: 2 }} className="glassy" key={i} component="div" id={`section-${i}`}>
                            <CardHeader
                                title={`Section ${i + 1}`}
                                subheader="Write something awesome!"
                                avatar={<NoteIcon />}
                                action={<IconButton onClick={() => remove(i)}>
                                    <DeleteIcon />
                                </IconButton>}
                            />
                            <CardContent>
                                <Stack gap={2}>
                                    <Field.Text name={`content.${i}.title`} label="Title" />
                                    <Field.Editor name={`content.${i}.content`} />
                                </Stack>
                            </CardContent>
                        </Card>), [content.length])
                    }
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Sections />
                </Grid>
            </Grid>
        </Form>
    </Box>
}

function Sections() {

    const { watch } = useFormContext();
    const contents: { title: string, content: string }[] = watch("content")

    return <Card className="glassy">
        <CardHeader
            title="Content List"
            subheader="Have a summary of your document."
            avatar={<SeeMoreIcon />}
        />
        <CardContent>
            <List dense>
                {
                    contents.map((x, i) => <ListItem key={i}>
                        <ListItemButton LinkComponent={Link} href={`#section-${i}`}>
                            <ListItemIcon>
                                <FleshRightIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={x.title}
                            />
                        </ListItemButton>
                    </ListItem>)
                }
            </List>
            {
                !contents.length && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                    you didn't create any section yet!
                </Typography>
            }
        </CardContent>
    </Card>
}