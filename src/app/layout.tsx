import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import ClientProviders from '../providers/ClientProviders';
import './globals.css';

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LoadLink Parcel Freight',
  description: 'Book and manage parcel freight deliveries across Australia',
  keywords: ['parcel freight', 'courier', 'delivery', 'shipping', 'Australia'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={openSans.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
