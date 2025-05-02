import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed font to Inter for a more professional look
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster'; // Add toaster for notifications

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pasantías UTN',
  description: 'Plataforma de gestión de pasantías de la UTN',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <Footer />
        <Toaster /> {/* Add Toaster component here */}
      </body>
    </html>
  );
}
