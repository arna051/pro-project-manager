import { IProject } from "@electron/model/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardActions, CardContent, CardHeader, Checkbox, Grid, Rating, Stack, TextField, Tooltip } from "@mui/material";
import { Field, Form } from "@next/components/hook-form";
import { AddIcon, DeleteIcon, TodoIcon } from "@next/components/icons";
import { TodoSchema } from "@next/validation/project";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProjectTodo({ project, reload }: { project: IProject, reload: VoidFunction }) {

    const methods = useForm({
        resolver: zodResolver(TodoSchema),
        defaultValues: {
            task: '',
            date: new Date(Date.now() + (1e3 * 60 * 60 * 24 * 7)),
            priority: 1
        }
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            await window.electron.db.update(
                "Project",
                { _id: project._id },
                {
                    $push: {
                        todos: {
                            ...data,
                            date: data.date.toISOString()
                        }
                    }
                }
            );

            methods.reset();

            reload()
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "cannot save todo!")
        }
    })

    return <Grid container spacing={2} >
        <Grid size={{ xs: 12 }}>
            <Form methods={methods} onSubmit={onSubmit}>
                <Card className="glassy" sx={{ height: '100%', minHeight: 460 }}>
                    <CardHeader
                        avatar={<TodoIcon />}
                        title="Todo"
                        subheader="Add job you have to get it done!"
                        action={<Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            type="submit"
                        >
                            Save
                        </Button>}
                    />
                    <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ mb: 2 }}>
                            <Controller
                                name="date"
                                control={methods.control}
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
                            <Field.Rating name="priority" />
                        </Stack>
                        <Field.Editor name="task" />
                    </CardContent>
                </Card>
            </Form>
        </Grid>
        {
            project
                .todos
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((x, i) =>
                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                        <Card className="glassy" sx={{ height: '100%', position: 'relative', minHeight: 460 }}>

                            <CardHeader
                                avatar={<TodoIcon />}
                                title={formatDate(x.date)}
                                subheader={<Rating readOnly size="small" value={x.priority} />}
                                action={<Tooltip title="mark as done">
                                    <Checkbox
                                        checked={!!x.done}
                                        onChange={(_, v) => {
                                            window.electron.db.update(
                                                "Project",
                                                { _id: project._id },
                                                {
                                                    $set: { 'todos.$[elem].done': v }
                                                },
                                                {
                                                    arrayFilters: [
                                                        { "elem.task": x.task } // condition to match the right todo
                                                    ]
                                                }
                                            ).then(reload);
                                        }}
                                    />
                                </Tooltip>}
                            />
                            <CardContent
                                component="div"
                                dangerouslySetInnerHTML={{ __html: x.task }}
                                sx={{ mb: 8 }}
                            />
                            <CardActions sx={{ justifyContent: 'end', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        window.electron.db.update(
                                            "Project",
                                            { _id: project._id },
                                            {
                                                $pull: {
                                                    todos: { task: x.task }
                                                }
                                            }
                                        ).then(reload);
                                    }}
                                >Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )
        }
    </Grid>
}

const formatDateForInput = (value?: Date) => (value ? dayjs(value).format("YYYY-MM-DD") : "");
const dateFromInput = (value: string) => (value ? dayjs(value).toDate() : undefined);

const formatDate = (value?: string | Date) => {
    if (!value) return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "—";
    return dayjs(date).format("MMM DD, YYYY");
};