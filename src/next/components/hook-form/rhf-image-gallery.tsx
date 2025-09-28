import { alpha, Box, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, IconButton, Pagination, Stack, Typography } from "@mui/material";
import { DeleteIcon, ExitIcon, GalleryIcon, SelectIcon } from "../icons";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FsAvatar } from "../avatar";

type Props = {
    onSelect: (id: string) => any
} & DialogProps


const limit = 20;

export function GalleryDialog({ onSelect, ...props }: Props) {

    const [files, setFiles] = useState<GSFile[]>([]);
    const [page, setPage] = useState(1)

    function load() {
        if (!props.open) return;
        window.electron.gridfs.list()
            .then(res => setFiles(res))
            .catch(err => toast.error(err instanceof Error ? err.message : "an error was happened while loading files"))
    }

    function handleDelete(id: string) {
        window
            .electron
            .gridfs
            .remove(id)
            .then(load)
            .catch(err => toast.error(err instanceof Error ? err.message : "an error was happened while deleting files"));
    }

    useEffect(load, [props.open])

    const pages = Math.ceil(files.length / limit)

    const paged = useMemo(() => {
        const start = (page - 1) * limit;
        const end = page * limit
        return files.slice(start, end)
    }, [files, page]);
    return <Dialog {...props}>
        <DialogTitle sx={theme => ({
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            boxShadow: `0 0 10px ${theme.palette.divider}`
        })}>
            <Box sx={{ height: 32 }} />
            <Stack direction="row" gap={2} alignItems="center">
                <GalleryIcon width={35} height={35} />
                <Stack sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h6">Gallery</Typography>
                    <Typography variant="subtitle2">Select from gallery.</Typography>
                </Stack>
                <IconButton onClick={props.onClose as any}>
                    <ExitIcon width={30} height={30} />
                </IconButton>
            </Stack>
        </DialogTitle>

        <DialogContent sx={{
            mt: 18,
            mb: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 1,
        }}>
            {
                paged.map(x => <Box
                    key={x._id.toString()}
                    sx={theme => ({
                        position: 'relative',
                        width: 250,
                        height: 250,
                        boxShadow: `0 0 5px ${theme.palette.divider}`,
                    })}
                >
                    <FsAvatar
                        src={x._id.toString()}
                        variant="square"
                        sx={{
                            width: '100%',
                            height: '100%'
                        }}
                        children={<GalleryIcon />}
                    />
                    <Box
                        sx={theme => ({
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            boxShadow: `0 0 10px ${theme.palette.divider}`,
                            backgroundColor: alpha(theme.palette.background.paper, .5),
                            transition: 'all .3s ease',
                            '& .actions': {
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                opacity: 0,
                                transition: 'all .4s ease'
                            },
                            '&:hover .actions': {
                                opacity: 1
                            },
                            ':hover': {
                                backgroundColor: alpha(theme.palette.background.paper, .1),
                            }
                        })}
                    >

                        <Box className="actions">
                            <IconButton onClick={() => handleDelete(x._id.toString())}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton onClick={() => {
                                onSelect(x._id.toString())
                                props.onClose?.({}, "escapeKeyDown")
                            }}>
                                <SelectIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>)
            }
        </DialogContent>

        <DialogActions sx={theme => ({
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            boxShadow: `0 0 10px ${theme.palette.divider}`
        })}>
            <Pagination
                count={pages}
                page={page}
                onChange={(_, p) => setPage(p)}
            />
        </DialogActions>
    </Dialog>
}