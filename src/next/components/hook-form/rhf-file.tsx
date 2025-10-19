import { alpha, Box, Button, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form"
import { toast } from "sonner";
import { DeleteIcon } from "../icons";

type Props = {
    name?: string
}



export default function RHFFile({ name = 'attachmentsIds' }: Props) {
    const { control } = useFormContext();


    return <Controller
        control={control}
        name={name}
        render={({ field }) => {
            const [imageError, setImageError] = useState<string | null>(null);
            const [isUploadingImage, setIsUploadingImage] = useState(false);
            const [isDragging, setIsDragging] = useState(false);

            const [files, setFiles] = useState<{ id: string, name: string }[]>([])

            useEffect(() => {
                const detach = window.electron.gridfs.onFileDrop((files) => {
                    setIsDragging(false);

                    handleUploadFromFile(files[0]);
                })

                const handleDragOver = (e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                };

                const handleDragLeave = (e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                };

                window.addEventListener("dragover", handleDragOver);
                window.addEventListener("dragleave", handleDragLeave);

                return () => {
                    window.removeEventListener("dragover", handleDragOver);
                    window.removeEventListener("dragleave", handleDragLeave);
                    detach()
                };
            }, []);
            const getFileName = (path: string) => path.split(/[/\\]/).pop() || '';

            const handleUploadFromFile = async (filePath: string) => {
                setImageError(null);
                setIsUploadingImage(true);


                if (!filePath) {
                    setIsUploadingImage(false);
                    setImageError("File path is unavailable. Drag files directly from your filesystem.");
                    return;
                }


                try {
                    const uploaded = await window.electron.gridfs.saveFromPath(
                        filePath,
                        {
                            source: "dropzone"
                        }
                    );
                    if (!uploaded) {
                        throw new Error("File upload failed");
                    }

                    const id = uploaded;
                    if (!id) {
                        throw new Error("Upload succeeded but file id is missing.");
                    }

                    setFiles(last => [...last, { id, name: getFileName(filePath) }])
                } catch (error) {
                    console.error("Image upload failed", error);
                    setImageError(error instanceof Error ? error.message : "Failed to upload image.");
                } finally {
                    setIsUploadingImage(false);
                }
            };

            const handleChooseFromDialog = async (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                setImageError(null);
                try {
                    const result = await window.electron.dialog.openFile({
                        properties: ["openFile"],
                    });
                    if (result.canceled || !result.filePaths?.length) {
                        return;
                    }
                    setIsUploadingImage(true);
                    const filePath = result.filePaths[0];
                    const uploaded = await window.electron.gridfs.saveFromPath(filePath, { source: "dialog" });
                    const id = uploaded;
                    if (!id) {
                        throw new Error("Upload succeeded but file id is missing.");
                    }
                    setFiles(last => [...last, { id, name: getFileName(filePath) }])
                } catch (error) {
                    console.error("Dialog-based upload failed", error);
                    setImageError(error instanceof Error ? error.message : "File selection failed.");
                } finally {
                    setIsUploadingImage(false);
                }
            };

            useEffect(() => {
                if (!imageError) return;
                toast.error(imageError)
            }, [imageError]);

            useEffect(() => {
                if (files.length === 0) return;
                field.onChange(files.map(x => x.id))
            }, [files])

            useEffect(() => {
                if (field.value.length) return;
                setFiles([])
            }, [field.value.length])
            return <>
                <Box
                    sx={(theme) => ({
                        position: "relative",
                        minHeight: 240,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                        bgcolor: "background.paper",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                        ...(isDragging && {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.16)}`,
                        }),
                    })}
                >
                    {isUploadingImage && <LinearProgress />}
                    <Stack spacing={1.5} alignItems="center" textAlign="center" px={4}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Drop Files here
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            up to 25 MB. You can also choose a file from disk.
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleChooseFromDialog as any}
                            >
                                Browse files
                            </Button>
                        </Stack>
                    </Stack>

                </Box>

                {
                    !!files.length && <Stack
                        gap={2}
                    >
                        {
                            files
                                .filter(x => field.value.some((n: string) => n === x.id))
                                .map((x) => <Box key={x.id}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography fontSize={9}>{x.name}</Typography>
                                        <IconButton size="small" onClick={() => {
                                            field.onChange(field.value.filter((n: string) => n !== x.id))
                                            setFiles(files => files.filter(n => n.id !== x.id))
                                        }}>
                                            <DeleteIcon width={14} height={14} />
                                        </IconButton>
                                    </Stack>
                                </Box>)
                        }
                    </Stack>
                }
            </>
        }}
    />
}