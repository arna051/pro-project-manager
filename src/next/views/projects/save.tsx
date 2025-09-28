"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Grid,
    Stack
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { alpha } from "@mui/material/styles";

import BGFade from "components/bg-fade";
import { Field, Form } from "components/hook-form";
import { AddIcon, DeleteIcon, DependencyIcon, DetailsIcon, ProjectIcon, SaveIcon, TodoIcon } from "components/icons";
import { ProjectSchema } from "validation/project";

import type { z } from "zod";
import type { ICategory } from "@electron/model/category";
import type { IContractor } from "@electron/model/contractor";
import type { IServer } from "@electron/model/server";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Hero from "@next/components/hero";
import { IProject } from "@electron/model/project";

// -----------------------------------------------------------------------------

type ProjectFormValues = z.infer<typeof ProjectSchema>;

type Option = {
    label: string;
    value: string;
};

const initial: ProjectFormValues = {
    title: "",
    image: "",
    priority: 0,
    todos: [],
    contractorIds: [],
    serversIds: [],
    description: "",
    categoryIds: [],
    repositoryIds: [],
};

const formatDateForInput = (value?: Date) => (value ? dayjs(value).format("YYYY-MM-DD") : "");
const dateFromInput = (value: string) => (value ? dayjs(value).toDate() : undefined);

const mapOptions = <T,>(items: T[], labelSelector: (item: T) => string): Option[] =>
    items
        .map((item) => {
            const id = (item as any)?._id;
            if (!id) {
                return null;
            }
            const label = labelSelector(item).trim();
            return {
                label: label || "Untitled",
                value: typeof id === "string" ? id : id.toString(),
            };
        })
        .filter(Boolean)
        .map((item) => item as Option)
        .sort((a, b) => a.label.localeCompare(b.label));

const sanitizePayload = (values: ProjectFormValues) => {
    return {
        title: values.title.trim(),
        image: values.image?.trim() ?? "",
        priority: Math.min(5, Math.max(0, Number.isFinite(values.priority) ? values.priority : 0)),
        description: values.description?.trim() ? values.description.trim() : undefined,
        contractorIds: values.contractorIds.filter(Boolean),
        categoryIds: values.categoryIds.filter(Boolean),
        serversIds: values.serversIds.filter(Boolean),
        repositoryIds: values.repositoryIds.filter(Boolean),
        todos: values.todos.map((todo) => ({
            ...todo,
            task: todo.task.trim(),
            date: todo.date ? new Date(todo.date) : new Date(),
        })),
    };
};

// -----------------------------------------------------------------------------

export default function SaveProject() {
    const params = useSearchParams();
    const router = useRouter();
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [options, setOptions] = useState<{
        categories: Option[];
        contractors: Option[];
        servers: Option[];
    }>({
        categories: [],
        contractors: [],
        servers: [],
    });

    const methods = useForm<ProjectFormValues>({
        resolver: zodResolver(ProjectSchema as any),
        defaultValues: initial,
    });

    const {
        control,
        handleSubmit,
        reset,
    } = methods;

    const id = params.get("id")

    const { fields: todoFields, append, remove } = useFieldArray({
        control,
        name: "todos",
    });



    useEffect(() => {
        let active = true;
        setLoadingOptions(true);
        (async () => {
            try {
                const [categories, contractors, servers, project] = await Promise.all([
                    window.electron.db.find<ICategory>("Category"),
                    window.electron.db.find<IContractor>("Contractor"),
                    window.electron.db.find<IServer>("Server"),
                    window.electron.db.doc<IProject>("Project", [{ $match: { _id: id } }])
                ]);
                if (!active) {
                    return;
                }
                setOptions({
                    categories: mapOptions(categories, (item) => item.title),
                    contractors: mapOptions(contractors, (item) => item.name),
                    servers: mapOptions(servers, (item) => item.title),
                });

                if (project) {
                    Object.keys(project).forEach(key => {
                        methods.setValue(key as any, (project as any)[key])
                    })
                }
            } catch (error) {
                console.error("Failed to load project dependencies", error);
                if (active) {
                    toast.error("Could not load related data. Try refreshing.")
                }
            } finally {
                if (active) {
                    setLoadingOptions(false);
                }
            }
        })();

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    const handleAddTodo = () =>
        append({
            task: "",
            date: new Date(),
            priority: 0,
        });


    const onSubmit = handleSubmit(async (values) => {
        try {
            const payload = sanitizePayload(values);
            if (id) await window.electron.db.update("Project", { _id: id }, { $set: payload });
            else await window.electron.db.save("Project", payload);
            toast.success("Project saved successfully.")
            reset({
                ...payload,
                priority: payload.priority,
                description: payload.description ?? "",
            });
            setTimeout(() => {
                router.push("/projects")
            }, 1e3);
        } catch (error) {
            console.error("Failed to save project", error);
            toast.error(error instanceof Error ? error.message : "Failed to save project. Please try again.")
        }
    });




    return (
        <Box sx={{ position: "relative", minHeight: "100%" }}>
            <BGFade height={520} />

            <Box sx={{ position: "relative", p: 2, pt: 6, pb: 10 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Hero
                        icon={ProjectIcon}
                        subtitle="Define the scope, collaborators and execution path."
                        title="Save Project"
                        button={{
                            text: "Save",
                            icon: <SaveIcon />,
                        }}
                        reset={reset}
                    />
                    <Grid container spacing={2} sx={{ my: 4 }} >
                        <Grid container spacing={2} size={{ xs: 12, md: 8 }}>
                            <Grid size={{ xs: 12 }}>
                                <Card className="glassy">
                                    <CardHeader
                                        title="Project essentials"
                                        subheader="Title, hero image and core narrative."
                                        action={<Field.Rating name="priority" max={5} />}
                                        avatar={<DetailsIcon />}
                                    />
                                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        <Field.Text
                                            name="title"
                                            label="Project title"
                                            placeholder="e.g. Replatform marketing website"
                                        />

                                        <Field.Editor
                                            name="description"
                                            placeholder="Describe goals, key personas, success metrics, blockers and extra notes..."
                                            slotProps={{ wrap: { minHeight: 220 } }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Card className="glassy">
                                    <CardHeader
                                        avatar={<TodoIcon />}
                                        title="Sprint todos"
                                        subheader="Break the work into actionable steps with due dates."
                                        action={
                                            <Button
                                                size="small"
                                                variant="contained"
                                                startIcon={<AddIcon width={16} height={16} />}
                                                onClick={handleAddTodo}
                                                disabled={todoFields.length >= 50}
                                            >
                                                Add todo
                                            </Button>
                                        }
                                    />
                                    {!todoFields.length && (<CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                                        <Box
                                            sx={(theme) => ({
                                                borderRadius: 2,
                                                border: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
                                                p: 3,
                                                textAlign: "center",
                                                color: "text.secondary",
                                            })}
                                        >
                                            No todos yet. Start outlining milestones to keep the project moving.
                                        </Box>

                                    </CardContent>)}
                                </Card>
                            </Grid>

                            {todoFields.map((todo, index) => {
                                return (
                                    <Grid
                                        key={todo.id}
                                        size={{ xs: 12 }}
                                        component={Card}
                                        className="glassy"
                                    >
                                        <CardContent>
                                            <Grid
                                                container
                                                spacing={2}
                                                alignItems="flex-end"
                                            >
                                                <Grid size={{ xs: 12 }}>
                                                    <Field.Editor
                                                        name={`todos.${index}.task`}
                                                        placeholder="Define the action to complete"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Controller
                                                        name={`todos.${index}.date`}
                                                        control={control}
                                                        render={({ field, fieldState }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                type="date"
                                                                label="Due date"
                                                                InputLabelProps={{ shrink: true }}
                                                                value={formatDateForInput(field.value)}
                                                                onChange={(event) =>
                                                                    field.onChange(dateFromInput(event.target.value) ?? new Date())
                                                                }
                                                                error={!!fieldState.error}
                                                                helperText={fieldState.error?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 5 }}>
                                                    <Field.Rating name={`todos.${index}.priority`} max={10} />
                                                </Grid>
                                                <Grid size={{ xs: 1 }}>
                                                    <IconButton
                                                        color="error"
                                                        aria-label="Remove todo"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        <Grid container spacing={2} size={{ xs: 12, md: 4 }} alignItems="start">
                            <Grid size={{ xs: 12 }} component={Stack} gap={2}>
                                <Card className="glassy">
                                    <Field.Image />
                                </Card>
                                <Card className="glassy">
                                    <CardHeader
                                        avatar={<DependencyIcon />}
                                        title="Relations &amp; dependencies"
                                        action={
                                            loadingOptions ? (
                                                <Chip label="Loading..." size="small" />
                                            ) : (
                                                <Chip label="Synced" size="small" color="success" variant="outlined" />
                                            )
                                        }
                                    />
                                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                        <Field.MultiSelect
                                            name="categoryIds"
                                            label="Categories"
                                            options={options.categories}
                                            placeholder={loadingOptions ? "Loading categories..." : "Select categories"}
                                            checkbox
                                            chip
                                            fullWidth
                                            disabled={loadingOptions}
                                            helperText="Organise the project into meaningful themes."
                                        />
                                        <Field.MultiSelect
                                            name="contractorIds"
                                            label="Contractors"
                                            options={options.contractors}
                                            placeholder={loadingOptions ? "Loading contractors..." : "Attach contractors"}
                                            checkbox
                                            chip
                                            fullWidth
                                            disabled={loadingOptions}
                                            helperText="Collaborators, customers or teams involved."
                                        />
                                        <Field.MultiSelect
                                            name="serversIds"
                                            label="Servers"
                                            options={options.servers}
                                            placeholder={loadingOptions ? "Loading servers..." : "Link servers"}
                                            checkbox
                                            chip
                                            fullWidth
                                            disabled={loadingOptions}
                                            helperText="Servers that will host or support this project."
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Form>
            </Box>
        </Box>
    );
}
