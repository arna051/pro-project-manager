import { Accordion, AccordionDetails, AccordionSummary, Chip, Stack, Typography } from "@mui/material"
import { AxiosError } from "axios"
type With<T> = T & { timestamp: number }
type Props = {
    errors: With<Error>[]
    axiosErrors: With<AxiosError>[]
    toolErrors: With<Error>[]
}
export function Errors({ axiosErrors, errors, toolErrors }: Props) {
    return !!(errors.length + axiosErrors.length + toolErrors.length) && <Accordion>
        <AccordionSummary>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                <Typography variant="caption">
                    System Errors
                </Typography>
                <Chip color="error" label={errors.length + axiosErrors.length + toolErrors.length} />
            </Stack>
        </AccordionSummary>
        <AccordionDetails>
            {
                errors.map(x => <Typography key={x.timestamp}>
                    {x.message}
                </Typography>)
            }
            {
                toolErrors.map(x => <Typography key={x.timestamp}>
                    {x.message}
                </Typography>)
            }
            {
                axiosErrors.map(x => <Typography key={x.timestamp}>
                    {x.message}
                </Typography>)
            }
        </AccordionDetails>
    </Accordion>
}