'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Star,
  Briefcase,
  Clock,
  Wallet,
  User,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Markets', href: '/markets', icon: BarChart3 },
    { name: 'Watchlist', href: '/watchlist', icon: Star },
    { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { name: 'Orders', href: '/orders', icon: Clock },
    { name: 'Virtual Wallet', href: '/wallet', icon: Wallet },
    { name: 'Demo Profile', href: '/profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 p-4 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          Trading Terminal
        </div>

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Simulator Info Box */}
      <div className="mt-auto pt-6">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Paper Trading Mode</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Trade with simulated virtual capital. Zero financial risk. Real-time Indian market metrics.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="text-[11px] text-blue-500 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
