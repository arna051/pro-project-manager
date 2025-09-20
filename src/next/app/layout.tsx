import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Pro Project Manager',
  description: 'Electron + Next.js desktop application scaffold',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
