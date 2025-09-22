import { Chip, Stack, TextField } from "@mui/material";
import SearchBox from "components/search";

export default function Search() {
    return <Stack
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        sx={{
            my: 4,
            position: 'relative',
        }}
    >
        <SearchBox />
        <Stack direction="row" gap={2} alignItems="center">
            <Chip
                variant="filled"
                label="Team contracts"
            />
            <Chip
                variant="filled"
                label="Personal contracts"
            />
            <Chip
                variant="outlined"
                label="Charity"
            />
            <Chip
                variant="outlined"
                label="Personal"
            />
            <Chip
                variant="outlined"
                label="Commercial"
            />
        </Stack>
    </Stack>
}