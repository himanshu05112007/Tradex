'use client';

import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency } from '@/utils/formatters';
import {
  User,
  Shield,
  Moon,
  Sun,
  RotateCcw,
  LogOut,
  Mail,
  Award,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

export default function ProfilePage() {
  const { theme, toggleTheme, resetDemoData, balance, holdings, orders, showToast } = useTrading();

  const handleLogout = () => {
    showToast('Demo Session', 'Logged out of simulated paper trading environment.', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-blue-500" />
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Trader Profile & Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your simulated trading credentials, user preferences, and data reset options.
        </p>
      </div>

      {/* User Information Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
          TX
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Himanshu (Demo Pro Trader)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Active Simulator
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> trader@tradex.demo
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Professional Tier
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" /> NSE/BSE Equity Segment
            </span>
          </div>

          <div className="pt-2 grid grid-cols-3 gap-3 text-center border-t border-slate-100 dark:border-navy-800/80">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-navy-950">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Holdings</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {holdings.length}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-navy-950">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Orders Executed</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {orders.length}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-navy-950">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Cash Balance</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                {formatCurrency(balance)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Display & Theme Preferences
        </h3>
        <p className="text-xs text-slate-400">
          Customize the aesthetic of your trading workspace.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm'
                : 'border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-850'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <div className="text-sm font-bold">Dark Navy</div>
              <div className="text-[11px] text-slate-400">Trading terminal mode</div>
            </div>
          </button>

          <button
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50 text-slate-900 shadow-sm'
                : 'border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-850'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <div className="text-sm font-bold">Clean Light</div>
              <div className="text-[11px] text-slate-400">High contrast daylight</div>
            </div>
          </button>
        </div>
      </div>

      {/* Simulation Reset & Session Control */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Data Management & Reset
        </h3>
        <p className="text-xs text-slate-400">
          Restore default simulated portfolio holdings and reset your cash balance back to starting parameters.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={resetDemoData}
            className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data to Default</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Demo Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
