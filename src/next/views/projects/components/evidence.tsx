import { IEvidence } from "@electron/model/evidence";
import { IProject } from "@electron/model/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, CardHeader, Chip, Stack } from "@mui/material";
import { getEvidences } from "@next/api/evidence";
import { Field, Form } from "@next/components/hook-form";
import { AddIcon, EvidenceIcon } from "@next/components/icons";
import SearchBox from "@next/components/search";
import { EvidenceZodSchema } from "@next/validation/evidence";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
    title: '',
    content: '',
    contractorsIds: [],
    attachmentsIds: []
}

export default function Evidences({ project }: { project: IProject }) {

    const [evidences, setEvidences] = useState<IEvidence[]>([]);

    const [search, setSearch] = useState("")

    const contractors = project.contractors || [];

    const methods = useForm({
        resolver: zodResolver(EvidenceZodSchema),
        defaultValues
    })


    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(async data => {
        try {
            await window.electron.db.save("Evidence", { ...data, projectId: project._id })
            load();
            toast.success("Evidence Added.")
            methods.reset()
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot save it")
        }
    });


    function load() {
        (async () => {
            try {
                const data = await getEvidences(`${project._id}`)
                setEvidences(data)
            }
            catch (err) {
                toast.error(err instanceof Error ? err.message : "cannot load evidence data!")
            }
        })()
    }

    useEffect(load, []);

    const regex = new RegExp(search, 'i');
    const filtered = evidences.filter(x => regex.test(x.title) || regex.test(x.content))

    return <>
        <Card className="glassy">
            <Form methods={methods} onSubmit={onSubmit}>
                <CardHeader
                    title="Evidence"
                    subheader="save contractor data"
                    avatar={<EvidenceIcon />}
                    action={<Button
                        startIcon={<AddIcon />}
                        variant="contained"
                        type="submit"
                    >
                        Save
                    </Button>}
                />
                <CardContent>
                    <Stack gap={2}>
                        <Field.Text name="title" label="Title" />
                        <Field.MultiSelect
                            name="contractorsIds"
                            label="Contractors"
                            options={contractors.map(x => ({ value: x._id.toString(), label: x.name }))}
                            chip
                            fullWidth
                            checkbox
                            helperText="Collaborators, customers or teams involved."
                        />
                        <Field.Editor name="content" />
                        <Field.File />
                    </Stack>
                </CardContent>
            </Form>
        </Card>

        <SearchBox value={search} onChange={e => setSearch(e.target.value)} dis={6} />


        {
            filtered
                .slice(0, 20)
                .map(x => <Card key={x._id.toString()} className="glassy">
                    <CardHeader
                        title={x.title}
                        avatar={<EvidenceIcon />}
                        subheader={<Stack direction="row">
                            {
                                x.contractors.map(n => n.name).join(", ")
                            }
                        </Stack>}
                    />
                    <CardContent>
                        <Box component="div" dangerouslySetInnerHTML={{ __html: x.content }} />
                        <Stack gap={.5}>
                            {
                                x.attachments.map(c => <Link
                                    key={`${c._id}`}
                                    href={`http://localhost:4568/${c._id}`}
                                    children={c.filename}
                                    target="_blank"
                                />)
                            }
                        </Stack>
                    </CardContent>
                </Card>)
        }
    </>
}