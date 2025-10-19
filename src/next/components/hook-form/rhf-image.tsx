import { alpha, Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form"
import { FsAvatar } from "../avatar";
import { toast } from "sonner";
import { DeleteIcon } from "../icons";
import { GalleryDialog } from "./rhf-image-gallery";

type Props = {
    name?: string
}

const IMAGE_FILTERS = [{ name: "Images", extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"] }];


export default function RHFImage({ name = 'image' }: Props) {
    const { control } = useFormContext();


    return <Controller
        control={control}
        name={name}
        render={({ field }) => {
            const [imageError, setImageError] = useState<string | null>(null);
            const [isUploadingImage, setIsUploadingImage] = useState(false);
            const [open, setOpen] = useState(false);
            const [isDragging, setIsDragging] = useState(false);

            useEffect(() => {
                window.electron.gridfs.onFileDrop((files) => {
                    setIsDragging(false);

                    handleUploadFromFile(files[0]); // send to main process
                    console.log("Dropped files:", files);
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
                };
            }, []);
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

                    field.onChange(id);
                } catch (error) {
                    console.error("Image upload failed", error);
                    setImageError(error instanceof Error ? error.message : "Failed to upload image.");
                    field.onChange("");
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
                        filters: IMAGE_FILTERS,
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
                    field.onChange(id)
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
            }, [imageError])
            return <Box
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
                {field.value ? (
                    <FsAvatar
                        variant="square"
                        src={field.value}
                        alt={field.value}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <Stack spacing={1.5} alignItems="center" textAlign="center" px={4}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Drop an image here
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            PNG, JPG, SVG, WEBP up to 25 MB. You can also choose a file from disk.
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleChooseFromDialog as any}
                            >
                                Browse files
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpen(true)}
                            >
                                Gallery
                            </Button>
                        </Stack>
                    </Stack>
                )}

                {
                    !!field.value && <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            left: 0
                        }}
                    >
                        <Button
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => field.onChange("")}
                        >
                            Remove Image
                        </Button>
                    </Stack>
                }

                <GalleryDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    onSelect={field.onChange}
                    slotProps={{
                        paper: {
                            className: 'glassy'
                        }
                    }}
                    fullScreen
                />
            </Box>
        }}
    />
}