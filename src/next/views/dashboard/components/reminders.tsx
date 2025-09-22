import { Card, CardContent, CardHeader, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import BGFade from "components/bg-fade";
import { InfoIcon, SeeMoreIcon, TodoIcon } from "components/icons";

export default function Reminders() {
    return <Card sx={{ position: 'relative', overflow: 'scroll', minHeight: 600, maxHeight: 600 }}>
        <BGFade height={300} />
        <CardHeader
            avatar={<TodoIcon />}
            title="Reminders"
            subheader="What you have to do next!"
            action={
                <IconButton>
                    <SeeMoreIcon />
                </IconButton>
            }
            sx={{ position: 'relative' }}
        />
        <CardContent>
            <List>
                {
                    [1, 2, 3, 4, 5, 6].map(x => <ListItem
                        key={x}
                        secondaryAction={
                            <IconButton edge="end" aria-label="info">
                                <InfoIcon />
                            </IconButton>
                        }
                        disablePadding
                    >
                        <ListItemButton role={undefined} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={!(x % 2)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={`Finish and initials next project`}
                                secondary={'project international'}
                            />
                        </ListItemButton>
                    </ListItem>)
                }
            </List>
        </CardContent>
    </Card>
}