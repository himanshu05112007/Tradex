'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTrading } from '@/context/TradingContext';
import { MARKET_INDICES } from '@/data/stocks';
import PortfolioSummaryCard from '@/components/common/PortfolioSummaryCard';
import MarketIndexCard from '@/components/common/MarketIndexCard';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Star,
  ExternalLink,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardPage() {
  const { stocks, watchlist, orders, holdings, openTradeModal, toggleWatchlist } = useTrading();

  // Top Gainers & Losers
  const topGainers = useMemo(() => {
    return [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  }, [stocks]);

  const topLosers = useMemo(() => {
    return [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  }, [stocks]);

  // Watchlist Stocks
  const watchlistStocks = useMemo(() => {
    return stocks.filter((s) => watchlist.includes(s.symbol)).slice(0, 5);
  }, [stocks, watchlist]);

  // Portfolio performance simulated trajectory points
  const portfolioHistory = useMemo(() => {
    const points = [
      { day: 'Mon', value: 485000 },
      { day: 'Tue', value: 489200 },
      { day: 'Wed', value: 494500 },
      { day: 'Thu', value: 491800 },
      { day: 'Fri', value: 501200 },
      { day: 'Mon', value: 506400 },
      { day: 'Today', value: 512300 },
    ];
    return points;
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Title & Simulator Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Trading Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time simulated market overview, portfolio tracking, and quick trade execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/markets"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Browse All Stocks</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Portfolio Summary KPI Cards */}
      <PortfolioSummaryCard />

      {/* Market Indices Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Market Indices
          </h2>
          <span className="text-[11px] text-slate-400">Updated: Live simulated feed</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_INDICES.map((idx) => (
            <MarketIndexCard key={idx.symbol} index={idx} />
          ))}
        </div>
      </div>

      {/* Portfolio Performance Chart & Watchlist Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Portfolio Performance
              </h2>
              <p className="text-xs text-slate-400">7-Day Value Trajectory</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5.62% this week</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-navy-950/95 border border-slate-700 p-2.5 rounded-lg shadow-xl">
                          <p className="text-slate-400 text-[10px]">{data.day}</p>
                          <p className="text-white text-sm font-bold font-mono">
                            {formatCurrency(data.value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#portfolioGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watchlist Preview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Watchlist</h2>
            </div>
            <Link
              href="/watchlist"
              className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View All ({watchlist.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-navy-800/80 flex-1">
            {watchlistStocks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Your watchlist is empty. Add stocks from the market table.
              </div>
            ) : (
              watchlistStocks.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <div
                    key={stock.symbol}
                    className="py-3 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-navy-850/50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-500 block"
                      >
                        {stock.symbol}
                      </Link>
                      <div className="text-[11px] text-slate-400 truncate max-w-[110px]">
                        {stock.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(stock.price)}
                      </div>
                      <div
                        className={`text-[10px] font-mono font-semibold ${
                          isPositive ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {formatPercent(stock.changePercent)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 pl-2">
                      <button
                        onClick={() => openTradeModal(stock, 'BUY')}
                        className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        B
                      </button>
                      <button
                        onClick={() => openTradeModal(stock, 'SELL')}
                        className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        S
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Top Gainers</h2>
            </div>
            <span className="text-[11px] text-emerald-500 font-semibold">Today&apos;s High Performers</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-navy-800/80">
            {topGainers.map((s) => (
              <div key={s.symbol} className="py-2.5 flex items-center justify-between">
                <div>
                  <Link
                    href={`/stocks/${s.symbol}`}
                    className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-500"
                  >
                    {s.symbol}
                  </Link>
                  <div className="text-[11px] text-slate-400">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(s.price)}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-emerald-500 flex items-center justify-end gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{s.change.toFixed(2)} ({formatPercent(s.changePercent)})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Top Losers</h2>
            </div>
            <span className="text-[11px] text-rose-500 font-semibold">Today&apos;s Dip Opportunities</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-navy-800/80">
            {topLosers.map((s) => (
              <div key={s.symbol} className="py-2.5 flex items-center justify-between">
                <div>
                  <Link
                    href={`/stocks/${s.symbol}`}
                    className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-500"
                  >
                    {s.symbol}
                  </Link>
                  <div className="text-[11px] text-slate-400">{s.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(s.price)}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-rose-500 flex items-center justify-end gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    <span>{s.change.toFixed(2)} ({formatPercent(s.changePercent)})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Orders</h2>
          </div>
          <Link
            href="/orders"
            className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-navy-800 text-slate-400 font-medium">
                <th className="py-2 px-3">Order ID</th>
                <th className="py-2 px-3">Stock</th>
                <th className="py-2 px-3">Side</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3 text-right">Quantity</th>
                <th className="py-2 px-3 text-right">Price</th>
                <th className="py-2 px-3 text-right">Total</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800/80">
              {orders.slice(0, 5).map((order) => {
                const isBuy = order.side === 'BUY';
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/50">
                    <td className="py-3 px-3 font-mono font-medium text-slate-500">
                      {order.id}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {order.symbol}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{order.type}</td>
                    <td className="py-3 px-3 text-right font-mono">{order.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">
                      {formatCurrency(order.price)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                      {order.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
