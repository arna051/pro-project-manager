"use client";

import { INote } from "@electron/model/note";
import { Box, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import { FleshRightIcon, NoteIcon } from "@next/components/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NoteShowView() {
    const params = useSearchParams();

    const id = params.get("id");

    const [note, setNote] = useState<INote>()

    function load() {
        window.electron.db.doc("Note", [
            {
                $match: {
                    _id: id
                }
            }
        ])
            .then(res => {
                if (!res) return toast.warning("the note was not found!");
                setNote(res);
            })
            .catch(err => toast.error(err instanceof Error ? err.message : "cannot load the note!"))
    }

    useEffect(load, [])
    return <Box sx={{ position: 'relative' }}>
        <BGFade height={800} />
        <Grid container>
            <Grid size={{ xs: 12, md: 9 }}>
                <Box sx={{
                    maxHeight: '100vh',
                    overflowY: 'scroll',
                    position: 'relative',
                    p: 2,
                    pt: 8
                }}>
                    <Typography variant="h1">
                        {note?.title}
                    </Typography>

                    <Stack gap={2} sx={{ my: 4 }}>
                        {
                            note?.content.map((x, i) => <Card key={x.title} className="glassy" component={"div"} id={`section-${i}`}>
                                <CardHeader title={x.title} />
                                <CardContent component="div" dangerouslySetInnerHTML={{ __html: x.content }} />
                            </Card>)
                        }
                    </Stack>
                </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <Box sx={{
                    maxHeight: '100vh',
                    overflowY: 'scroll',
                    position: 'relative',
                    p: 2,
                    pt: 8,
                    bgcolor: 'background.paper',
                    height: '100%'
                }}>
                    <Stack direction="row" alignItems="center" gap={2}>
                        <NoteIcon />
                        <Typography variant="h6" fontWeight="bold">
                            Content Summary
                        </Typography>
                    </Stack>
                    <List dense sx={{ my: 2, p: 0 }}>
                        {
                            note?.content.map((x, i) => <ListItem key={x.title} sx={{ p: 0 }}>
                                <ListItemButton
                                    LinkComponent={Link}
                                    href={`#section-${i}`}
                                >
                                    <ListItemIcon>
                                        <FleshRightIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={x.title} />
                                </ListItemButton>
                            </ListItem>)
                        }
                    </List>
                </Box>
            </Grid>
        </Grid>
    </Box>
}