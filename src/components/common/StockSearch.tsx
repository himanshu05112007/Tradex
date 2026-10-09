'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface StockSearchProps {
  placeholder?: string;
}

export default function StockSearch({ placeholder = 'Search 20+ Indian stocks (e.g. RELIANCE, TCS)...' }: StockSearchProps) {
  const router = useRouter();
  const { stocks, openTradeModal } = useTrading();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/stocks/${symbol}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-navy-850 border border-transparent dark:border-navy-700/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-navy-900 transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-100 dark:border-navy-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Stocks Matching &ldquo;{query}&rdquo;</span>
            <span>{results.length} results</span>
          </div>

          {results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching stocks found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-navy-800/80">
              {results.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <div
                    key={stock.symbol}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-navy-800/50 flex items-center justify-between transition-colors group cursor-pointer"
                    onClick={() => handleSelect(stock.symbol)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-slate-400">
                          {stock.sector}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-400 truncate max-w-[200px]">
                        {stock.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {formatCurrency(stock.price)}
                        </div>
                        <div
                          className={`text-[11px] font-mono flex items-center justify-end gap-0.5 ${
                            isPositive ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{formatPercent(stock.changePercent)}</span>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            openTradeModal(stock, 'BUY');
                          }}
                          className="px-2 py-1 text-[11px] font-bold rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          BUY
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-2 border-t border-slate-100 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60 text-center">
            <Link
              href="/markets"
              onClick={() => setIsOpen(false)}
              className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Explore all stocks in Market Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
