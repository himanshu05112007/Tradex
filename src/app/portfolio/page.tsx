'use client';

import React from 'react';
import Link from 'next/link';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  IndianRupee,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];

export default function PortfolioPage() {
  const { holdings, portfolioSummary, stocks, openTradeModal } = useTrading();

  const isTotalPos = portfolioSummary.totalPnl >= 0;
  const isTodayPos = portfolioSummary.todaysPnl >= 0;

  // Chart data: holdings distribution
  const allocationData = holdings.map((h) => ({
    name: h.symbol,
    value: h.currentValue,
  }));

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Portfolio Holdings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time equity holdings, profit & loss analytics, and capital allocation.
          </p>
        </div>

        <Link
          href="/markets"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Buy More Stocks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Financial Summary Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Portfolio Value
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(portfolioSummary.totalValue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Includes {formatCurrency(portfolioSummary.availableCash)} virtual cash
          </p>
        </div>

        {/* Invested Amount */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Invested Amount
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {formatCurrency(portfolioSummary.investedAmount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Current Equity: {formatCurrency(portfolioSummary.currentValue)}
          </p>
        </div>

        {/* Overall Profit/Loss */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total P&L
            </span>
            <div
              className={`p-1 rounded ${
                isTotalPos ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}
            >
              {isTotalPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            </div>
          </div>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              isTotalPos ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isTotalPos ? '+' : ''}
            {formatCurrency(portfolioSummary.totalPnl)}
          </div>
          <p className="text-[11px] font-mono font-semibold text-slate-400 mt-1">
            Return: {formatPercent(portfolioSummary.totalPnlPercent)}
          </p>
        </div>

        {/* Today's Profit/Loss */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today&apos;s Return
            </span>
            <div
              className={`p-1 rounded ${
                isTodayPos ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
              }`}
            >
              {isTodayPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            </div>
          </div>
          <div
            className={`text-2xl font-bold font-mono mt-1 ${
              isTodayPos ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isTodayPos ? '+' : ''}
            {formatCurrency(portfolioSummary.todaysPnl)}
          </div>
          <p className="text-[11px] font-mono font-semibold text-slate-400 mt-1">
            Day Return: {formatPercent(portfolioSummary.todaysPnlPercent)}
          </p>
        </div>
      </div>

      {/* Allocation Chart & Insights */}
      {holdings.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Portfolio Asset Allocation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Donut Chart */}
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-navy-950/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                            <span className="text-white font-bold">{data.name}: </span>
                            <span className="text-blue-400 font-mono font-semibold">
                              {formatCurrency(Number(data.value))}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] uppercase font-bold text-slate-400">Holdings</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  {holdings.length}
                </span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {holdings.map((h, idx) => {
                const totalEquity = portfolioSummary.currentValue || 1;
                const weight = ((h.currentValue / totalEquity) * 100).toFixed(1);
                return (
                  <div
                    key={h.symbol}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center gap-3"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {h.symbol}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {weight}% &bull; {formatCurrency(h.currentValue)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Holdings Detailed Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Holdings Breakdown ({holdings.length})
          </h2>
          <span className="text-xs text-slate-400">Simulated Equity Positions</span>
        </div>

        {holdings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center mx-auto text-slate-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No holdings in your portfolio yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t bought any stocks yet. Use your ₹{portfolioSummary.availableCash.toLocaleString('en-IN')} virtual cash to start paper trading!
            </p>
            <div className="pt-2">
              <Link
                href="/markets"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 shadow-sm"
              >
                <span>Browse Markets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60 text-slate-400 font-medium">
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Avg Price</th>
                  <th className="py-3 px-4 text-right">LTP (Current)</th>
                  <th className="py-3 px-4 text-right">Invested</th>
                  <th className="py-3 px-4 text-right">Current Value</th>
                  <th className="py-3 px-4 text-right">Overall P&L</th>
                  <th className="py-3 px-4 text-center">Trade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800/80">
                {holdings.map((h) => {
                  const liveStock = stocks.find((s) => s.symbol === h.symbol);
                  const isPos = h.pnl >= 0;

                  return (
                    <tr
                      key={h.symbol}
                      className="hover:bg-slate-50 dark:hover:bg-navy-850/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/stocks/${h.symbol}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors block"
                        >
                          {h.symbol}
                        </Link>
                        <div className="text-xs text-slate-400 truncate max-w-[150px]">
                          {h.stockName}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                        {h.quantity}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        {formatCurrency(h.avgBuyPrice)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(h.currentPrice)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        {formatCurrency(h.investedValue)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(h.currentValue)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono">
                        <div
                          className={`font-bold ${
                            isPos ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {isPos ? '+' : ''}
                          {formatCurrency(h.pnl)}
                        </div>
                        <div
                          className={`text-[11px] ${
                            isPos ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {formatPercent(h.pnlPercent)}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {liveStock && (
                            <>
                              <button
                                onClick={() => openTradeModal(liveStock, 'BUY')}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                              >
                                BUY
                              </button>
                              <button
                                onClick={() => openTradeModal(liveStock, 'SELL')}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                              >
                                SELL
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
