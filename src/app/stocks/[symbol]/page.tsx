'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useTrading } from '@/context/TradingContext';
import StockChart from '@/components/common/StockChart';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Building2,
  PieChart,
  ShieldAlert,
  Briefcase,
} from 'lucide-react';

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params?.symbol as string)?.toUpperCase();
  const { stocks, isWatchlisted, toggleWatchlist, openTradeModal, holdings } = useTrading();

  const stock = stocks.find((s) => s.symbol === symbol);

  if (!stock) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Stock Not Found</h2>
        <p className="text-slate-400 text-sm">
          No stock symbol matches &ldquo;{symbol}&rdquo; in our simulated exchange.
        </p>
        <Link
          href="/markets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Markets</span>
        </Link>
      </div>
    );
  }

  const inWatchlist = isWatchlisted(stock.symbol);
  const isPositive = stock.change >= 0;
  const holding = holdings.find((h) => h.symbol === stock.symbol);

  return (
    <div className="space-y-6">
      {/* Back button and quick navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/markets"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Markets</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWatchlist(stock.symbol)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              inWatchlist
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-500' : ''}`} />
            <span>{inWatchlist ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Stock Main Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {stock.symbol}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              {stock.sector}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-500 font-mono">
              NSE / BSE
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stock.name}</p>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {formatCurrency(stock.price)}
            </span>
            <div
              className={`flex items-center gap-1 text-sm font-bold font-mono px-2 py-0.5 rounded ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPositive ? '+' : ''}
                {stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
              </span>
            </div>
          </div>

          {/* Quick Trade Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openTradeModal(stock, 'BUY')}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              BUY {stock.symbol}
            </button>
            <button
              onClick={() => openTradeModal(stock, 'SELL')}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all"
            >
              SELL {stock.symbol}
            </button>
          </div>
        </div>
      </div>

      {/* Holdings status alert if user owns this stock */}
      {holding && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              You own {holding.quantity} shares of {stock.symbol} (Avg: {formatCurrency(holding.avgBuyPrice)})
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono font-medium">
            <span>Invested: {formatCurrency(holding.investedValue)}</span>
            <span>Current: {formatCurrency(holding.currentValue)}</span>
            <span className={holding.pnl >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
              P&L: {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)} ({formatPercent(holding.pnlPercent)})
            </span>
          </div>
        </div>
      )}

      {/* Interactive Price Chart with 1D, 1W, 1M, 3M, 1Y filters */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="mb-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Historical Price Action
          </h2>
          <p className="text-xs text-slate-400">
            Interactive area chart with timeframe filters and crosshair inspection.
          </p>
        </div>

        <StockChart history={stock.history} height={380} showFilters={true} />
      </div>

      {/* Key Metrics: OHLC, Volume, Market Cap, P/E Ratio */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Open</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{stock.open.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">High</div>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-500 mt-1">
            ₹{stock.high.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Low</div>
          <div className="text-sm sm:text-base font-bold font-mono text-rose-500 mt-1">
            ₹{stock.low.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Prev Close</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{stock.prevClose.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Volume</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            {stock.volume}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Market Cap</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            {stock.marketCap}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">P/E Ratio</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            {stock.peRatio}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Div. Yield</div>
          <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            {stock.dividendYield}%
          </div>
        </div>
      </div>

      {/* Company Overview & Fundamentals */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Company Overview & Business Profile
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {stock.description}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Paper trading data simulated for training and testing purposes only.</span>
        </div>
      </div>
    </div>
  );
}
