'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency } from '@/utils/formatters';
import {
  Wallet,
  PlusCircle,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Sparkles,
  History,
} from 'lucide-react';

export default function WalletPage() {
  const { balance, addFunds, orders } = useTrading();
  const [customAmount, setCustomAmount] = useState<string>('');

  const depositPresets = [10000, 50000, 100000, 500000];

  const handleDeposit = (amount: number) => {
    addFunds(amount);
  };

  const handleCustomDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!isNaN(val) && val > 0) {
      addFunds(val);
      setCustomAmount('');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-5 h-5 text-blue-500" />
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Virtual Funds Wallet
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your simulated capital for paper trading. Instant deposits with zero real money.
        </p>
      </div>

      {/* Main Balance Display Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-navy-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Paper Trading Account</span>
            </div>
            <div className="text-sm font-medium text-blue-100">Available Virtual Cash</div>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-1">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-blue-200 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Simulated capital &bull; LocalStorage persisted &bull; Ready for deployment
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <div className="text-xs text-blue-200">Quick Add:</div>
            <div className="grid grid-cols-2 gap-2">
              {depositPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleDeposit(preset)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 backdrop-blur-md transition-all text-center"
                >
                  +{formatCurrency(preset)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Custom Amount Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-blue-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Deposit Custom Simulated Amount
          </h2>
        </div>

        <form onSubmit={handleCustomDeposit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
              ₹
            </span>
            <input
              type="number"
              min="100"
              max="50000000"
              step="1000"
              placeholder="Enter amount (e.g. 250000)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!customAmount || parseFloat(customAmount) <= 0}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-sm transition-all"
          >
            Deposit Funds
          </button>
        </form>
      </div>

      {/* Recent Virtual Transactions / Order Cash Flows */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Virtual Cash Flows
            </h2>
          </div>
          <span className="text-xs text-slate-400">Order Deductions & Credits</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No recent transaction activity.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-navy-800/80">
            {orders.slice(0, 8).map((order) => {
              const isBuy = order.side === 'BUY';

              return (
                <div
                  key={order.id}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-navy-850/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isBuy
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      {isBuy ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {isBuy ? 'Bought' : 'Sold'} {order.quantity} shares of {order.symbol}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {order.timestamp} &bull; Order #{order.id}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        isBuy ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    >
                      {isBuy ? '-' : '+'}
                      {formatCurrency(order.total)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {order.type} @ {formatCurrency(order.price)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
