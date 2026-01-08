import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agent Payment Rails',
  description: 'Dashboard for managing AI agent wallets and payments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <header className="border-b px-6 py-4">
            <h1 className="text-xl font-bold">Agent Payment Rails</h1>
          </header>
          <main className="p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
