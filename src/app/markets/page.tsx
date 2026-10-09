'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTrading } from '@/context/TradingContext';
import { MARKET_INDICES, SECTOR_PERFORMANCE } from '@/data/stocks';
import MarketIndexCard from '@/components/common/MarketIndexCard';
import StockTable from '@/components/common/StockTable';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function MarketsPage() {
  const { stocks } = useTrading();

  // Top Gainers & Losers
  const topGainers = useMemo(() => {
    return [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  }, [stocks]);

  const topLosers = useMemo(() => {
    return [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
  }, [stocks]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Markets Directory
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track leading Indian indices, sector trends, and live simulated price action across 20+ benchmark equities.
        </p>
      </div>

      {/* Market Indices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Benchmark Indices
          </h2>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            NSE & BSE Feeds
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_INDICES.map((idx) => (
            <MarketIndexCard key={idx.symbol} index={idx} />
          ))}
        </div>
      </div>

      {/* Sector Performance Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Sector Performance
            </h2>
          </div>
          <span className="text-xs text-slate-400">NSE Sectoral Indices</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SECTOR_PERFORMANCE.map((sector) => {
            const isPos = sector.changePercent >= 0;
            return (
              <div
                key={sector.name}
                className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800/80 flex flex-col justify-between"
              >
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate mb-1">
                  {sector.name}
                </div>
                <div
                  className={`text-xs font-bold font-mono flex items-center gap-0.5 ${
                    isPos ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {formatPercent(sector.changePercent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gainers & Losers Quick Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Gainers */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Leading Gainers
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {topGainers.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-emerald-500/20 hover:border-emerald-500 transition-all block"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">{stock.symbol}</div>
                <div className="text-xs font-mono font-bold text-emerald-500 mt-1">
                  +{formatPercent(stock.changePercent)}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {formatCurrency(stock.price)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" /> Top Losers
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {topLosers.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stocks/${stock.symbol}`}
                className="p-2.5 rounded-lg bg-white dark:bg-navy-900 border border-rose-500/20 hover:border-rose-500 transition-all block"
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">{stock.symbol}</div>
                <div className="text-xs font-mono font-bold text-rose-500 mt-1">
                  {formatPercent(stock.changePercent)}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {formatCurrency(stock.price)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              All Listed Stocks (20)
            </h2>
            <p className="text-xs text-slate-400">
              Filter by sector, search symbol, or place simulated buy and sell orders.
            </p>
          </div>
        </div>

        <StockTable showFilters={true} />
      </div>
    </div>
  );
}
