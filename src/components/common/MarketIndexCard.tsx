'use client';

import React from 'react';
import { MarketIndex } from '@/types';
import { formatNumber, formatPercent } from '@/utils/formatters';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketIndexCardProps {
  index: MarketIndex;
}

export default function MarketIndexCard({ index }: MarketIndexCardProps) {
  const isPositive = index.change >= 0;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm hover:border-slate-300 dark:hover:border-navy-700 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          {index.name}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
              : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {formatPercent(index.changePercent)}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
          {formatNumber(index.value)}
        </span>
        <span
          className={`text-xs font-semibold font-mono ${
            isPositive ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          {isPositive ? '+' : ''}
          {formatNumber(index.change)}
        </span>
      </div>

      {/* Mini sparkline */}
      <div className="h-10 w-full -mb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={index.history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={1.5}
              fill={fillColor}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
