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
    <html lang='en' className='h-full'>
      <body className='h-full'>
        <ReactQueryProvider>
          <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1 px-5 bg-blue-100'>{children}</main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
