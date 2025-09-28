import { IContractor } from "@electron/model/contractor";
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from "@mui/material";
import { FsAvatar } from "@next/components/avatar";
import { LocationIcon } from "@next/components/icons";

export default function Contractors({ contractors }: { contractors?: IContractor[] }) {
    if (!contractors?.length) return null;
    return <Grid container spacing={1}>
        {
            contractors.map(x => <Grid
                key={x._id.toString()}
                size={{ xs: 12 }}>
                <Card sx={{ position: 'relative', height: '100%', minHeight: 250 }} className="glassy">
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0,
                        zIndex: 0,
                        height: 200,
                        maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
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
                                opacity: .5
                            }}
                        />
                    </Box>

                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        direction="row"
                        sx={{
                            mt: '50px',
                        }}>
                        <FsAvatar
                            src={x.avatar}
                            alt={x.name}
                            sx={{
                                width: 85,
                                height: 85
                            }}
                        />
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
                                x.phones.map(y => <Chip size="small" key={y} label={y} />)
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
}