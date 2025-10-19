import { Box, Stack } from "@mui/material";
import SettingsHero from "./components/hero";
import TerminalSettings from "./components/terminal";
import TerminalProxiedSettings from "./components/proxy-terminal";
import ProxyCommand from "./components/proxy";
import BackgroundSettings from "./components/backgrounds";
import FileBrowserSettings from "./components/file-browser";
import InternetBrowserSettings from "./components/internet-browser";
import IDESettings from "./components/ide";
import DeepseekSettings from "./components/deepseek";

export default function SettingsView() {
    return <Box sx={{ position: 'relative', p: 2, pt: 6 }}>
        <SettingsHero />
        <Stack gap={2}>
            <TerminalSettings />
            <TerminalProxiedSettings />
            <ProxyCommand />
            <FileBrowserSettings />
            <InternetBrowserSettings />
            <IDESettings />
            <DeepseekSettings />
            <BackgroundSettings />
        </Stack>
    </Box>
}