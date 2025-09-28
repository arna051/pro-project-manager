import { ICategory } from "@electron/model/category";
import { Box, InputBase, Paper, Stack } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import GradientButton from "@next/components/gradient-button";
import { AddIcon } from "components/icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    onSave: VoidFunction
    category: ICategory | null
}
export default function SaveCategory({ onSave, category }: Props) {

    const theme = useTheme();
    const [title, setTitle] = useState("");

    const gradient = (theme: Theme, deg: number = 45) => `linear-gradient(${deg}deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`


    function handleSave() {
        if (category) return window.electron.db.update("Category", { _id: category._id }, { $set: { title } })
            .then(() => {
                toast.success("Category Saved!")
                onSave();
                setTitle("")
            })
            .catch(err => {
                console.log(err);

                toast.error("We have an error!")
            })
        window.electron.db.save("Category", { title })
            .then(() => {
                toast.success("Category Saved!")
                onSave();
                setTitle("")
            })
            .catch(err => {
                toast.error(err)
            })
    }

    useEffect(() => {
        setTitle(category?.title || "")
    }, [category])
    return <Box
        sx={{
            position: 'relative',
            width: 400
        }}
    >
        <Stack
            direction="row"
            alignItems="center"
            component={Paper}
            gap={2}
            sx={{
                p: .5,
                overflow: 'hidden',
                transition: 'all .2s ease',
                px: 2,
                borderRadius: 3,
                ':after': {
                    content: '""',
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    right: '-8px',
                    bottom: '-8px',
                    background: gradient(theme),
                    borderRadius: '10px',
                    zIndex: -1,
                    filter: 'blur(40px)',
                    transition: 'all .4s ease',
                },
                ':hover': {
                    ':after': {
                        background: gradient(theme, -45),
                    },
                }
            }}
        >
            <AddIcon />
            <InputBase
                placeholder="Category Name"
                sx={{
                    p: 1
                }}
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <GradientButton onClick={handleSave}>
                Save
            </GradientButton>
        </Stack>
    </Box>
}