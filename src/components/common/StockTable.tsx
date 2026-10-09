'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Stock } from '@/types';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { Star, TrendingUp, TrendingDown, Search, ArrowUpDown } from 'lucide-react';

interface StockTableProps {
  stocks?: Stock[];
  limit?: number;
  showFilters?: boolean;
}

export default function StockTable({
  stocks: customStocks,
  limit,
  showFilters = true,
}: StockTableProps) {
  const { stocks: allStocks, isWatchlisted, toggleWatchlist, openTradeModal } = useTrading();
  const baseStocks = customStocks || allStocks;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'changePercent'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Sectors list
  const sectors = useMemo(() => {
    const list = Array.from(new Set(allStocks.map((s) => s.sector)));
    return ['ALL', ...list];
  }, [allStocks]);

  // Filtering & Sorting
  const filteredStocks = useMemo(() => {
    let result = baseStocks.filter((s) => {
      const matchesSearch =
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'ALL' || s.sector === selectedSector;
      return matchesSearch && matchesSector;
    });

    result.sort((a, b) => {
      if (sortBy === 'symbol') {
        return sortOrder === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      }
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
      if (sortBy === 'changePercent') {
        return sortOrder === 'asc'
          ? a.changePercent - b.changePercent
          : b.changePercent - a.changePercent;
      }
      return 0;
    });

    if (limit) {
      return result.slice(0, limit);
    }
    return result;
  }, [baseStocks, searchQuery, selectedSector, sortBy, sortOrder, limit]);

  const toggleSort = (field: 'symbol' | 'price' | 'changePercent') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="w-full space-y-4">
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search stocks (e.g. RELIANCE, TCS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Sector selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60 text-slate-500 dark:text-slate-400 font-medium">
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('symbol')}>
                <div className="flex items-center gap-1">
                  <span>Stock</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 hidden md:table-cell">Sector</th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white" onClick={() => toggleSort('changePercent')}>
                <div className="flex items-center justify-end gap-1">
                  <span>24h Change</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right hidden lg:table-cell">Day High / Low</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800/80">
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No stocks found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => {
                const inWatchlist = isWatchlisted(stock.symbol);
                const isPositive = stock.change >= 0;

                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleWatchlist(stock.symbol)}
                        className={`transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-navy-800 ${
                          inWatchlist
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-400 hover:text-amber-400'
                        }`}
                        title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star className={`w-4 h-4 ${inWatchlist ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        href={`/stocks/${stock.symbol}`}
                        className="group-hover:text-blue-500 transition-colors block"
                      >
                        <div className="font-bold text-slate-900 dark:text-white">{stock.symbol}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                          {stock.name}
                        </div>
                      </Link>
                    </td>

                    <td className="py-3 px-4 hidden md:table-cell text-xs text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-[11px] font-medium">
                        {stock.sector}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(stock.price)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          {isPositive ? '+' : ''}
                          {stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right hidden lg:table-cell font-mono text-xs text-slate-500 dark:text-slate-400">
                      <div>H: ₹{stock.high.toFixed(2)}</div>
                      <div>L: ₹{stock.low.toFixed(2)}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openTradeModal(stock, 'BUY')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all"
                        >
                          BUY
                        </button>
                        <button
                          onClick={() => openTradeModal(stock, 'SELL')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all"
                        >
                          SELL
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
