import { Card, CardContent } from "@mui/material";

export default function ProjectDesc({ value }: { value?: string }) {
    if (!value || value.length < 2) return null;
    return <Card className="glassy">
        <CardContent
            component="div"
            dangerouslySetInnerHTML={{ __html: value }}
        />
    </Card>
}