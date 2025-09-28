import "./global.css"
import "@xterm/xterm/css/xterm.css";
import type { ReactNode } from 'react';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ThemeRegistry from 'theme/ThemeRegistry';
import MainLayout from 'layouts';
import { NoSsr } from "@mui/material";
import { Toaster } from 'sonner';
import { DeployProvider } from "@next/deploy/provider";

export const metadata = {
  title: 'Pro Project Manager',
  description: 'Electron + Next.js desktop application scaffold',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode='dark' />
        <ThemeRegistry>
          <NoSsr>
            <DeployProvider>
              <MainLayout>
                {children}
                <Toaster />
              </MainLayout>
            </DeployProvider>
          </NoSsr>
        </ThemeRegistry>
      </body>
    </html>
  );
}
