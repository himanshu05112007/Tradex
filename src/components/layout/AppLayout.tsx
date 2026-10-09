'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import OrderModal from '@/components/common/OrderModal';
import ToastContainer from '@/components/common/ToastContainer';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex w-full">
        {!isLandingPage && <Sidebar />}

        <main className={`flex-1 overflow-x-hidden ${isLandingPage ? 'w-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'}`}>
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <OrderModal />
      <ToastContainer />
    </div>
  );
}
