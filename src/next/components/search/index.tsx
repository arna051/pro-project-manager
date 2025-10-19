import { Box, InputBase, InputProps, Paper, Stack } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import { SearchIcon } from "components/icons";

type Props = InputProps
export default function SearchBox({ dis = 1, ...props }: Props & { dis?: number }) {

    const theme = useTheme()

    const gradient = (theme: Theme, deg: number = 45) => `linear-gradient(${deg}deg,${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`

    return <Box
        sx={{
            position: 'relative',
            maxWidth: 400,
            width: '100%',
            my: dis
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
            <SearchIcon />
            <InputBase
                placeholder="Search..."
                sx={{
                    p: 1
                }}
                {...props}
            />
        </Stack>
    </Box>
}