'use client';

import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { StockHistory } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface StockChartProps {
  history: StockHistory;
  height?: number;
  showFilters?: boolean;
}

type TimeframeKey = '1D' | '1W' | '1M' | '3M' | '1Y';

export default function StockChart({
  history,
  height = 340,
  showFilters = true,
}: StockChartProps) {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1D');
  const data = history[timeframe] || history['1D'];

  const startPrice = data.length > 0 ? data[0].price : 0;
  const endPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const isPositive = endPrice >= startPrice;

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const padding = (maxPrice - minPrice) * 0.1 || 5;

  const timeframes: TimeframeKey[] = ['1D', '1W', '1M', '3M', '1Y'];

  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';

  return (
    <div className="w-full flex flex-col">
      {showFilters && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-navy-950 rounded-lg border border-slate-200 dark:border-navy-800">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-semibold font-mono ${
                isPositive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {isPositive ? '+' : ''}
              {(((endPrice - startPrice) / (startPrice || 1)) * 100).toFixed(2)}% in {timeframe}
            </span>
          </div>
        </div>
      )}

      <div style={{ width: '100%', height }} className="relative select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${isPositive ? 'pos' : 'neg'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => `₹${Math.round(v)}`}
              orientation="right"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-navy-950/95 border border-slate-700/80 p-2.5 rounded-lg shadow-xl backdrop-blur-md">
                      <p className="text-slate-400 text-[10px] font-medium">{item.time}</p>
                      <p className="text-white text-sm font-bold font-mono mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${isPositive ? 'pos' : 'neg'})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
