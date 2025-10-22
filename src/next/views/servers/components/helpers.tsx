import { Alert, AlertTitle, Stack } from "@mui/material"
import DashboardView from "@next/views/dashboard"
import { StatusIcon } from "./icons"
import { ShinyText } from "@next/components/react-bits/shiny"
import BGFade from "@next/components/bg-fade"

import img1 from "@next/assets/coding-background-9izlympnd0ovmpli.jpg";
import img2 from "@next/assets/coder-programming-computer-screen-computer.jpg";
import img3 from "@next/assets/1358310.png";
import img4 from "@next/assets/pro1.jpg";
import img5 from "@next/assets/pro2.jpeg";

type Props = {
    apiKey?: string
    messages: any[]
    dashboard?: boolean
}
export function Banners({ apiKey, dashboard, messages }: Props) {
    return <>
        {!apiKey && <Alert severity="warning">
            <AlertTitle>Enable Deepseek</AlertTitle>
            for better performance and better answers from AI. please enable deepseek from settings.
        </Alert>}
        {
            messages.length === 1 && dashboard && <DashboardView />
        }
        {!dashboard && <Alert severity="info">
            <AlertTitle>Caution</AlertTitle>
            Artificial intelligence tools can potentially harm your server if used improperly. They may consume excessive resources, modify critical files, or execute unsafe operations. Use AI features with caution and always review generated code or commands before running them.
        </Alert>}
    </>
}

export function AILoading({ loading, messages }: { loading: boolean, messages: any[] }) {
    return loading ? (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: "text.secondary", fontSize: 12 }}>
            <StatusIcon messages={messages} loading={loading} />
            <ShinyText
                text="Thinking..."
                speed={1}
            />
        </Stack>
    ) : null

}

export function AIBackground() {
    return <BGFade height="100vh" images={[img1.src, img2.src, img3.src, img4.src, img5.src]} isNotFs />
}