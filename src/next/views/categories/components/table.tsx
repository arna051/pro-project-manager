import { ICategory } from "@electron/model/category";
import { IProject } from "@electron/model/project";
import { Card, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import BGFade from "@next/components/bg-fade";
import { DeleteIcon, EditIcon } from "@next/components/icons";
import { useEffect, useState } from "react";


type Props = { categories: ICategory[], onDelete: (id: string) => any, onEdit: (id: string) => any }
export default function CategoriesTable({ categories, onDelete, onEdit }: Props) {
    return <Card sx={{ position: 'relative', maxWidth: '95%', mx: 'auto', minHeight: 400 }}>
        <BGFade height={350} opacity={.9} />
        <TableContainer sx={{ position: 'relative' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell width={10}>#</TableCell>
                        <TableCell width={100}>Name</TableCell>
                        <TableCell>Projects</TableCell>
                        <TableCell width={50}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        categories.map((x, i) => <Row
                            key={x._id.toString()}
                            category={x}
                            num={i + 1}
                            onDelete={() => onDelete(x._id.toString())}
                            onEdit={() => onEdit(x._id.toString())}
                        />)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </Card>
}

function Row({ category, onDelete, onEdit, num }: { num: number, category: ICategory, onDelete: VoidFunction, onEdit: VoidFunction }) {

    const [projects, setProjects] = useState<IProject[]>([]);

    useEffect(() => {
        window.electron.db.find<IProject>("Project")
            .then((res) => {
                setProjects(res.filter(x => x.categoryIds.includes(category._id)))
            })
    }, [])

    return <TableRow>
        <TableCell>{num}</TableCell>
        <TableCell>{category.title}</TableCell>
        <TableCell>
            <Stack direction="row" alignItems="center" gap={2}>
                <Chip color="info" label={projects.length} />
                <Typography variant="caption">
                    {
                        projects.slice(0, 5).map(x => x.title).join(", ")
                    }
                </Typography>
            </Stack>
        </TableCell>
        <TableCell>
            <Stack direction="row" justifyContent="end">
                <IconButton size="small" color="error" aria-label="Delete category" onClick={onDelete}>
                    <DeleteIcon width={18} height={18} />
                </IconButton>
                <IconButton size="small" color="primary" aria-label="Edit category" onClick={onEdit}>
                    <EditIcon width={18} height={18} />
                </IconButton>
            </Stack>
        </TableCell>
    </TableRow>
}