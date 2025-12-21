import type { Metadata } from 'next';
import './globals.css';
import Header from '@/layout/Header';
import ReactQueryProvider from './providers/ReactQueryProvider';

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
        <ReactQueryProvider>
          <Header />
          <main>{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
