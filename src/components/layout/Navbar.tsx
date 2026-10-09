'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency } from '@/utils/formatters';
import ThemeToggle from '@/components/common/ThemeToggle';
import StockSearch from '@/components/common/StockSearch';
import {
  TrendingUp,
  Wallet,
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Star,
  Briefcase,
  Clock,
  User,
  ShieldAlert,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { balance } = useTrading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Markets', href: '/markets', icon: BarChart3 },
    { name: 'Watchlist', href: '/watchlist', icon: Star },
    { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
    { name: 'Orders', href: '/orders', icon: Clock },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-navy-800 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Trade<span className="text-blue-500">X</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Simulated
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Medium & Large screens) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <StockSearch />
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          {/* Virtual Balance Chip */}
          <Link
            href="/wallet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
          >
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[10px] uppercase font-semibold text-slate-400 leading-none">
                Virtual Cash
              </div>
              <div className="text-xs font-bold font-mono text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {formatCurrency(balance)}
              </div>
            </div>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Avatar Link */}
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-navy-800 border border-slate-300 dark:border-navy-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors"
            title="Demo User Profile"
          >
            <span className="font-bold text-xs">TX</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="pb-2">
            <StockSearch />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-navy-900 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Paper Trading Simulator
            </span>
            <Link
              href="/wallet"
              onClick={() => setMobileMenuOpen(false)}
              className="text-blue-500 font-bold hover:underline"
            >
              Add Virtual Funds &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
