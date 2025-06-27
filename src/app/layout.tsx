import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { FloatingChatButton } from '@/components/FloatingChatButton';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BPolls - Decentralized Polling on Citrea',
  description: 'Create and participate in decentralized polls on the Citrea blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <FloatingChatButton />
          </div>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}