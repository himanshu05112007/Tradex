'use client';

import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Wallet, PieChart, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioSummaryCard() {
  const { portfolioSummary } = useTrading();
  const isOverallPositive = portfolioSummary.totalPnl >= 0;
  const isTodayPositive = portfolioSummary.todaysPnl >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Portfolio Total Value */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Portfolio</span>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
          {formatCurrency(portfolioSummary.totalValue)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Invested:</span>
          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
            {formatCurrency(portfolioSummary.investedAmount)}
          </span>
        </div>
      </div>

      {/* Available Virtual Balance */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Virtual Balance</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
          {formatCurrency(portfolioSummary.availableCash)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Simulated Cash</span>
          <Link
            href="/wallet"
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            + Add Funds
          </Link>
        </div>
      </div>

      {/* Today's Profit/Loss */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Today&apos;s P&L</span>
          <div
            className={`p-1.5 rounded-lg ${
              isTodayPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-500'
            }`}
          >
            {isTodayPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div
          className={`text-2xl font-bold font-mono ${
            isTodayPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {isTodayPositive ? '+' : ''}
          {formatCurrency(portfolioSummary.todaysPnl)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Day Return</span>
          <span
            className={`font-semibold font-mono ${
              isTodayPositive ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {formatPercent(portfolioSummary.todaysPnlPercent)}
          </span>
        </div>
      </div>

      {/* Overall Profit/Loss */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Overall Returns</span>
          <div
            className={`p-1.5 rounded-lg ${
              isOverallPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-500'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-2xl font-bold font-mono ${
            isOverallPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {isOverallPositive ? '+' : ''}
          {formatCurrency(portfolioSummary.totalPnl)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Total Return</span>
          <span
            className={`font-semibold font-mono ${
              isOverallPositive ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {formatPercent(portfolioSummary.totalPnlPercent)}
          </span>
        </div>
      </div>
    </div>
  );
}
