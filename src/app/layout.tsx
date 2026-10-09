import type { Metadata } from 'next';
import './globals.css';
import { TradingProvider } from '@/context/TradingContext';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'TradeX — Professional Stock Trading Platform & Simulator',
  description: 'Trade smarter and invest better with simulated paper trading, real-time Indian stock metrics, and professional portfolio tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-50 dark:bg-navy-950 font-sans">
        <TradingProvider>
          <AppLayout>{children}</AppLayout>
        </TradingProvider>
      </body>
    </html>
  );
}
