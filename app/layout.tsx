import './globals.css';
import { Providers } from './providers';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Subname Registration',
  description: 'Register a subname for your wallet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-background`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
