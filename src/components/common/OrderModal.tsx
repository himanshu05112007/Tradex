'use client';

import React, { useState, useEffect } from 'react';
import { useTrading } from '@/context/TradingContext';
import { OrderSide, OrderType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { X, ShieldAlert, ArrowUpRight, ArrowDownRight, Wallet, Info } from 'lucide-react';

export default function OrderModal() {
  const { tradeModal, closeTradeModal, placeOrder, balance, holdings } = useTrading();
  const { isOpen, stock, side: initialSide } = tradeModal;

  const [side, setSide] = useState<OrderSide>(initialSide);
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<number>(1);
  const [limitPrice, setLimitPrice] = useState<number>(stock?.price || 100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stock) {
      setSide(initialSide);
      setLimitPrice(stock.price);
      setQuantity(1);
      setOrderType('MARKET');
    }
  }, [stock, initialSide, isOpen]);

  if (!isOpen || !stock) return null;

  const activePrice = orderType === 'MARKET' ? stock.price : (limitPrice || stock.price);
  const estimatedTotal = Number((quantity * activePrice).toFixed(2));
  const currentHolding = holdings.find((h) => h.symbol === stock.symbol);
  const ownedQuantity = currentHolding ? currentHolding.quantity : 0;

  const isBuy = side === 'BUY';
  const hasSufficientFunds = isBuy ? balance >= estimatedTotal : true;
  const hasSufficientShares = !isBuy ? ownedQuantity >= quantity && quantity > 0 : true;
  const canSubmit = quantity > 0 && (isBuy ? hasSufficientFunds : hasSufficientShares);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    const result = placeOrder({
      symbol: stock.symbol,
      stockName: stock.name,
      type: orderType,
      side,
      quantity,
      price: activePrice,
    });

    setIsSubmitting(false);
    if (result.success) {
      closeTradeModal();
    }
  };

  const quantityPresets = [5, 10, 25, 50, 100];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700/80 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{stock.symbol}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                {stock.sector}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stock.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                {formatCurrency(stock.price)}
              </div>
              <div
                className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                  stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {stock.change >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {stock.change >= 0 ? '+' : ''}
                  {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <button
              onClick={closeTradeModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls: BUY / SELL */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2 text-sm font-bold rounded-lg transition-all ${
                side === 'BUY'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2 text-sm font-bold rounded-lg transition-all ${
                side === 'SELL'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              SELL
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Type: Market vs Limit */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                ORDER TYPE
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('MARKET')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    orderType === 'MARKET'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-navy-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800'
                  }`}
                >
                  Market (At Best Price)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('LIMIT')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    orderType === 'LIMIT'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-navy-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-800'
                  }`}
                >
                  Limit (Custom Price)
                </button>
              </div>
            </div>

            {/* Inputs: Quantity & Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  QUANTITY
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  PRICE (₹)
                </label>
                <input
                  type="number"
                  step="0.05"
                  disabled={orderType === 'MARKET'}
                  value={orderType === 'MARKET' ? stock.price.toFixed(2) : limitPrice || ''}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    orderType === 'MARKET'
                      ? 'bg-slate-100 dark:bg-navy-950/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-navy-800 cursor-not-allowed'
                      : 'bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white border-slate-300 dark:border-navy-700'
                  }`}
                />
              </div>
            </div>

            {/* Quantity quick chips */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">Presets:</span>
              {quantityPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantity(preset)}
                  className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                    quantity === preset
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-300 dark:border-navy-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  +{preset}
                </button>
              ))}
              {!isBuy && (
                <button
                  type="button"
                  onClick={() => setQuantity(ownedQuantity)}
                  className="px-2 py-0.5 text-xs rounded border border-rose-500/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 ml-auto"
                >
                  All ({ownedQuantity})
                </button>
              )}
            </div>

            {/* Balances & Validation Info */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" /> Virtual Balance:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {formatCurrency(balance)}
                </span>
              </div>

              {!isBuy && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Shares Owned:
                  </span>
                  <span className={`font-semibold font-mono ${ownedQuantity > 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-500'}`}>
                    {ownedQuantity} shares
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Estimated Total:
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>

            {/* Error alerts */}
            {isBuy && !hasSufficientFunds && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Insufficient virtual cash. Need ₹{(estimatedTotal - balance).toFixed(2)} more.</span>
              </div>
            )}

            {!isBuy && !hasSufficientShares && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>You only own {ownedQuantity} shares. Reduce quantity to sell.</span>
              </div>
            )}

            {/* Simulated disclaimer */}
            <div className="text-[11px] text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Demo Environment • Simulated Execution • Virtual Money
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                !canSubmit
                  ? 'bg-slate-300 dark:bg-navy-800 text-slate-500 dark:text-slate-600 cursor-not-allowed shadow-none'
                  : isBuy
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] shadow-emerald-900/30'
                  : 'bg-rose-600 hover:bg-rose-500 active:scale-[0.99] shadow-rose-900/30'
              }`}
            >
              {isSubmitting ? 'Executing...' : `Confirm ${side} Order`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
