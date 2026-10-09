'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTrading } from '@/context/TradingContext';
import { OrderStatus } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Clock, CheckCircle2, AlertCircle, XCircle, ArrowRight, Filter } from 'lucide-react';

export default function OrdersPage() {
  const { orders, cancelOrder } = useTrading();
  const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('ALL');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'ALL') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const counts = useMemo(() => {
    return {
      ALL: orders.length,
      EXECUTED: orders.filter((o) => o.status === 'EXECUTED').length,
      OPEN: orders.filter((o) => o.status === 'OPEN').length,
      CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
    };
  }, [orders]);

  const tabs: { key: 'ALL' | OrderStatus; label: string }[] = [
    { key: 'ALL', label: 'All Orders' },
    { key: 'EXECUTED', label: 'Executed' },
    { key: 'OPEN', label: 'Open / Pending' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-blue-500" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Order Book & History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View simulated order executions, pending limit orders, and audit history.
          </p>
        </div>

        <Link
          href="/markets"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Place New Order</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-navy-800 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center mx-auto text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No {activeTab.toLowerCase()} orders found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Simulated trades you execute will appear here with timestamps, fill prices, and status.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60 text-slate-400 font-medium">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Side</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Time</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800/80">
                {filteredOrders.map((order) => {
                  const isBuy = order.side === 'BUY';
                  const isExecuted = order.status === 'EXECUTED';
                  const isOpen = order.status === 'OPEN';
                  const isCancelled = order.status === 'CANCELLED';

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 dark:hover:bg-navy-850/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                        {order.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <Link
                          href={`/stocks/${order.symbol}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-500 transition-colors"
                        >
                          {order.symbol}
                        </Link>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {order.stockName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            isBuy
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          }`}
                        >
                          {order.side}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-slate-500">
                        {order.type}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                        {order.quantity}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {formatCurrency(order.price)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isExecuted
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : isOpen
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-slate-500/10 text-slate-400'
                          }`}
                        >
                          {isExecuted && <CheckCircle2 className="w-3 h-3" />}
                          {isOpen && <AlertCircle className="w-3 h-3" />}
                          {isCancelled && <XCircle className="w-3 h-3" />}
                          <span>{order.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                        {order.timestamp}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isOpen ? (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-2.5 py-1 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
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
