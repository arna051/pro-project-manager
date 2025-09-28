import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Rating, Stack, Tooltip, Typography } from "@mui/material";
import { Data, Todo } from "../type";
import dayjs from "dayjs";
import { DeleteIcon, ProjectIcon, SeeMoreIcon } from "@next/components/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
    data: Data[]
}


const formatDate = (value?: string | Date) => {
    if (!value) return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "—";
    return dayjs(date).format("MMM DD, YYYY");
};


function color(timestamp: number) {
    const t = Date.now();
    if (timestamp < t) return "error";
    const d = (timestamp - t) / (1e3 * 60 * 60 * 24);
    if (d < 10) return "warning";
    return "success";
}
export default function Timeline({ data }: Props) {
    return <Box sx={{ py: 4, position: 'relative', mt: 6 }}>
        {
            data.map((item, i) => <Box
                sx={{
                    width: '100%'
                }}
                key={item.date}>

                <Stack direction='row' justifyContent="center" alignItems="center" gap={2} sx={{ my: .5 }}>
                    <Typography variant="subtitle2" sx={{ visibility: !(i % 2) ? "hidden" : "visible" }}>
                        {formatDate(new Date(item.date))}
                    </Typography>
                    <Box
                        sx={{
                            bgcolor: `${color(item.date)}.main`,
                            height: 10,
                            width: 10,
                            borderRadius: '50%',
                            position: 'relative'
                        }}
                    />
                    <Typography variant="subtitle2" sx={{ visibility: i % 2 ? "hidden" : "visible" }}>
                        {formatDate(new Date(item.date))}
                    </Typography>
                </Stack>

                <Row
                    item={item}
                    even={!(i % 2)}
                />

            </Box>)
        }
    </Box>
}

function Row({ even, item: { data, date } }: { item: Data, even: boolean }) {

    return <Stack direction='row'>
        <Box sx={theme => ({
            width: '50%',
            borderRight: `1px solid ${theme.palette[color(date)].main}`,
            p: 2,
            pb: 6,
            visibility: even ? "hidden" : "visible",
        })}
        >
            <Stack gap={2}>
                {
                    data.map(x => <View {...x} key={x.task} />)
                }
            </Stack>
        </Box>
        <Box sx={theme => ({
            width: '50%',
            borderLeft: `1px solid ${theme.palette[color(date)].main}`,
            p: 2,
            pb: 6,
            visibility: !even ? "hidden" : "visible"
        })}
        >
            <Stack gap={2}>
                {
                    data.map(x => <View {...x} key={x.task} />)
                }
            </Stack>
        </Box>
    </Stack>
}

function View({ done, priority, projectId, projectTitle, task }: Todo) {
    const [marked, setMarked] = useState(!!done);
    const [hide, setHide] = useState(false);

    function handleUpdate() {
        window.electron.db.update(
            "Project",
            { _id: projectId },
            {
                $set: { 'todos.$[elem].done': marked }
            },
            {
                arrayFilters: [
                    { "elem.task": task } // condition to match the right todo
                ]
            }
        );
    }
    function handleDelete() {
        setHide(true);
        window.electron.db.update(
            "Project",
            { _id: projectId },
            {
                $pull: {
                    todos: { task }
                }
            }
        );
    }

    useEffect(handleUpdate, [marked])

    return <Card
        key={task}
        className="glassy"
        sx={{
            opacity: marked ? .6 : 1,
            display: hide ? "none" : "block"
        }}>
        <CardHeader
            avatar={<ProjectIcon />}
            title={projectTitle}
            subheader={<Rating readOnly value={priority} size="small" />}
            action={<Tooltip title="mark as done">
                <Checkbox
                    checked={marked}
                    onChange={(_, v) => setMarked(v)}
                />
            </Tooltip>}
        />
        <CardContent component={"div"} dangerouslySetInnerHTML={{ __html: task }} />
        <CardActions>
            <Button
                LinkComponent={Link}
                href={`/projects/${projectId}`}
                startIcon={<SeeMoreIcon />}
                variant="contained"
                size="small"
            >Visit Project</Button>

            <Button
                variant="text"
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
                size="small"
            >
                Delete
            </Button>
        </CardActions>
    </Card>
}