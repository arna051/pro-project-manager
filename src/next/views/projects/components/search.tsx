import { ICategory } from "@electron/model/category";
import { Chip, Stack } from "@mui/material";
import { AddIcon } from "@next/components/icons";
import SearchBox from "components/search";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";


type Props = {
    search: string;
    onSearchChange: (value: string) => void;
    category: string[];
    onCategory: Dispatch<SetStateAction<string[]>>;
};

export default function Search({ search, onSearchChange, category, onCategory }: Props) {
    const [categories, setCategories] = useState<ICategory[]>([]);

    function load() {
        window.electron.db.find("Category")
            .then(res => setCategories(res))
            .catch(err => toast.error("We have an error!"))
    };

    useEffect(load, [])
    return (
        <Stack
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            sx={{
                my: 4,
                position: "relative",
            }}
        >
            <SearchBox
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
            />
            <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
                {categories.map((filter) => (
                    <Chip
                        key={filter._id as any}
                        variant={category.some(x => x === filter._id as any) ? "filled" : "outlined"}
                        color={category.some(x => x === filter._id as any) ? "primary" : "default"}
                        label={filter.title}
                        onClick={() => onCategory(last => last.some(x => x === filter._id as any) ? last.filter(x => x !== filter._id as any) : [...last, filter._id as any])}
                    />
                ))}
                <Chip
                    variant="filled"
                    color="primary"
                    label="New Category"
                    icon={<AddIcon />}
                    component={Link}
                    href="/categories"
                    sx={{ cursor: 'pointer' }}
                />
            </Stack>
        </Stack>
    );
}
