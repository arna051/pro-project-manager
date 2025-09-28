import { IContractor } from "@electron/model/contractor"
import { Box, Card, CardContent, Chip, Container, Grid, IconButton, Stack, Typography } from "@mui/material"
import { FsAvatar } from "@next/components/avatar"
import { DeleteIcon, EditIcon, LocationIcon } from "@next/components/icons"
import Link from "next/link"

type Props = {
    contractors: IContractor[]
    onDelete: (id: string) => any
}
export default function ContractorItems({ contractors, onDelete }: Props) {

    return <Container maxWidth="lg">
        <Grid container spacing={1}>
            {
                contractors.map(x => <Grid
                    key={x._id.toString()}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card sx={{ position: 'relative', height: '100%', minHeight: 250 }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            zIndex: 0,
                            height: 100,
                            maskImage: 'linear-gradient(to bottom, black 0%, transparent 95%)',
                        }}>
                            <FsAvatar
                                src={x.avatar}
                                alt={x.name}
                                variant="square"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                    objectFit: 'cover',
                                    height: '100%',
                                    width: '100%',
                                    filter: 'blur(8px)',
                                }}
                            />
                        </Box>

                        <Stack
                            alignItems="center"
                            justifyContent="space-between"
                            direction="row"
                            sx={{
                                mt: '50px',
                            }}>
                            <IconButton onClick={() => onDelete(x._id.toString())}>
                                <DeleteIcon />
                            </IconButton>
                            <FsAvatar
                                src={x.avatar}
                                alt={x.name}
                                sx={{
                                    width: 85,
                                    height: 85
                                }}
                            />
                            <IconButton LinkComponent={Link} href={`/contractors/save?id=${x._id}`}>
                                <EditIcon />
                            </IconButton>
                        </Stack>

                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                        }}>
                            <CardContent>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {x.name}
                                </Typography>
                            </CardContent>
                        </Box>
                        <CardContent>
                            <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 2 }}>
                                <LocationIcon />
                                <Typography variant="caption">
                                    {x.address}
                                </Typography>
                            </Stack>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                                {
                                    x.phones.map(y => <Chip key={y} label={y} />)
                                }
                            </Stack>
                            <Box sx={{ my: 2 }}>
                                <Box component="div" dangerouslySetInnerHTML={{ __html: x.description || "" }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>)
            }
        </Grid>
    </Container>
}