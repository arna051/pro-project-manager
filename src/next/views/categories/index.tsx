import { Box, Stack } from "@mui/material";
import CategoriesHero from "./components/hero";
import SaveCategory from "./components/add";
import { useEffect, useState } from "react";
import { ICategory } from "@electron/model/category";
import { toast } from "sonner";
import CategoriesTable from "./components/table";

export default function CategoriesView() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [category, setCategory] = useState<ICategory | null>(null)

    function load() {
        setCategory(null)
        window.electron.db.find("Category")
            .then(res => setCategories(res))
            .catch(err => toast.error("We have an error!"))
    }
    function onDelete(id: string) {
        window.electron.db.remove("Category", { _id: id })
            .then(load)
            .catch((err: any) => toast.error("We have an error!"))
    }

    useEffect(load, [])
    return <Box sx={{ p: 2, pt: 6 }}>
        <CategoriesHero />
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{
            height: 200
        }}>
            <SaveCategory onSave={load} category={category} />
        </Stack>

        <CategoriesTable
            categories={categories}
            onDelete={onDelete}
            onEdit={id => setCategory(categories.find(x => x._id.toString() === id) || null)}
        />
    </Box>
}