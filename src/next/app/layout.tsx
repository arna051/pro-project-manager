import "./global.css"
import type { ReactNode } from 'react';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ThemeRegistry from 'theme/ThemeRegistry';
import MainLayout from 'layouts';
import { NoSsr } from "@mui/material";

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
          <MainLayout>
            <NoSsr>
              {children}
            </NoSsr>
          </MainLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
