import type { Metadata } from 'next';
import './globals.css';
import Header from '@/layout/Header';
import ReactQueryProvider from './providers/ReactQueryProvider';
import { Inter } from 'next/font/google';
import Footer from '@/layout/Footer';

export const metadata: Metadata = {
  title: 'BookEasy',
  description: 'Reservations made simple',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`h-full ${inter.className}`}>
      <body className='h-full'>
        <ReactQueryProvider>
          <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-1 bg-slate-50'>{children}</main>
            <Footer />
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
