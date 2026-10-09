'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import {
  Star,
  Search,
  TrendingUp,
  TrendingDown,
  Trash2,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function WatchlistPage() {
  const { stocks, watchlist, toggleWatchlist, openTradeModal } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');

  // Watchlisted Stocks
  const watchlistedStocks = useMemo(() => {
    return stocks
      .filter((s) => watchlist.includes(s.symbol))
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [stocks, watchlist, searchQuery]);

  // Non-watchlisted stocks for quick addition
  const unwatchlistedStocks = useMemo(() => {
    return stocks.filter((s) => !watchlist.includes(s.symbol)).slice(0, 5);
  }, [stocks, watchlist]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              My Watchlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor tracked equities, stream simulated quotes, and trade with one click.
          </p>
        </div>

        <Link
          href="/markets"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Explore All Stocks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Search within watchlist */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter tracked stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Main Watchlist Grid / Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Tracked Stocks ({watchlistedStocks.length})
          </h2>
          <span className="text-xs text-slate-400">Auto-saved to LocalStorage</span>
        </div>

        {watchlistedStocks.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center mx-auto text-slate-400">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No stocks in your watchlist
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add stocks from the markets page or use the recommendations below to populate your watchlist.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60 text-slate-400 font-medium">
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Day Change</th>
                  <th className="py-3 px-4 text-right">Day High/Low</th>
                  <th className="py-3 px-4 text-center">Trade</th>
                  <th className="py-3 px-4 text-center w-12">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800/80">
                {watchlistedStocks.map((stock) => {
                  const isPos = stock.change >= 0;

                  return (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-slate-50 dark:hover:bg-navy-850/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/stocks/${stock.symbol}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors block"
                        >
                          {stock.symbol}
                        </Link>
                        <div className="text-xs text-slate-400 truncate max-w-[150px]">
                          {stock.name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {stock.sector}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(stock.price)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                            isPos
                              ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                              : 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                          }`}
                        >
                          {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>
                            {isPos ? '+' : ''}
                            {stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                        <span>₹{stock.high.toFixed(1)} / ₹{stock.low.toFixed(1)}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openTradeModal(stock, 'BUY')}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            BUY
                          </button>
                          <button
                            onClick={() => openTradeModal(stock, 'SELL')}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            SELL
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleWatchlist(stock.symbol)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove from Watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suggested Stocks to Add */}
      {unwatchlistedStocks.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recommended Additions to Watchlist
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {unwatchlistedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {formatCurrency(stock.price)}
                  </div>
                </div>
                <button
                  onClick={() => toggleWatchlist(stock.symbol)}
                  className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                  title="Add to Watchlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
