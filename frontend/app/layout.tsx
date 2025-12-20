import type { Metadata } from 'next';
import './globals.css';
import Header from '@/layout/Header';

export const metadata: Metadata = {
  title: 'BookEasy',
  description: 'Reservations made simple',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
