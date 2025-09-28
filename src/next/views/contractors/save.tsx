import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardContent, Grid, IconButton, InputAdornment, Stack } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import Hero from "@next/components/hero";
import { Field, Form } from "@next/components/hook-form";
import { AddIcon, ContractorsIcon, MinesIcon, SaveIcon } from "@next/components/icons";
import { ContractorSchema } from "@next/validation/contractor";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const initial = {
    name: '',
    address: '',
    phones: [],
    description: '',
    avatar: ''
}

export default function ContractorSave() {
    const params = useSearchParams();
    const router = useRouter();

    const id = params.get("id");

    const methods = useForm<any>({
        resolver: zodResolver(ContractorSchema),
        defaultValues: initial,
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset
    } = methods;

    const { fields: phones, append, remove } = useFieldArray({
        control,
        name: "phones",
    });


    const onSubmit = handleSubmit(data => {
        if (id) return window
            .electron
            .db
            .update("Contractor", { _id: id }, { $set: data })
            .then(() => {
                toast.success("Contractor was saved!")
                router.push("/contractors");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })

        window
            .electron
            .db
            .save("Contractor", data)
            .then(() => {
                toast.success("Contractor was saved!")
                router.push("/contractors");
            })
            .catch(err => {
                toast.error(err instanceof Error ? err.message : "We have an error!")
            })
    })


    useEffect(() => {
        if (!id) return
        window.electron.db.doc("Contractor", [{ $match: { _id: id } }])
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
                icon={ContractorsIcon}
                title="Save Contractor"
                subtitle="Craft new Contracts with new customer"
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
                                <Field.Text name="name" label="Contractor Name" />
                                <Field.Text name="address" label="Address" />
                                {
                                    phones.map((_, i) => <Field.Text
                                        name={`phones.${i}`}
                                        key={`phones.${i}`}
                                        label="Phone"
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">
                                                    <IconButton color="error" onClick={() => remove(i)}>
                                                        <MinesIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        }}
                                    />)
                                }
                                <Stack direction="row" justifyContent="end" sx={{ width: '100%' }}>
                                    <Button
                                        endIcon={<AddIcon />}
                                        onClick={() => append("")}
                                    >
                                        Add Phone
                                    </Button>
                                </Stack>
                                <Field.Editor name="description" />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Field.Image name="avatar" />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Form>
    </Box>
}