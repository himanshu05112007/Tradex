'use client';

import React from 'react';
import Link from 'next/link';
import { MARKET_INDICES } from '@/data/stocks';
import MarketIndexCard from '@/components/common/MarketIndexCard';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart2,
  PieChart,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: 'Ultra-Fast Paper Trading',
      desc: 'Simulate Market & Limit orders instantaneously with zero latency and realistic price fulfillment.',
      accent: 'from-amber-500/20 to-orange-500/20 text-amber-500',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Financial Risk',
      desc: 'Practice trading strategies with ₹5,00,000 virtual balance without risking real capital.',
      accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
    },
    {
      icon: BarChart2,
      title: 'Interactive Price Charts',
      desc: 'Multi-timeframe historical trend analysis with 1D, 1W, 1M, 3M, and 1Y views powered by Recharts.',
      accent: 'from-blue-500/20 to-indigo-500/20 text-blue-500',
    },
    {
      icon: PieChart,
      title: 'Portfolio & P&L Analytics',
      desc: 'Real-time calculation of overall and daily P&L, holdings distribution, and virtual wallet tracking.',
      accent: 'from-purple-500/20 to-pink-500/20 text-purple-500',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Explore Markets & Indices',
      desc: 'Browse top Indian equities like Reliance, TCS, and Infosys along with NIFTY 50 and SENSEX benchmark movements.',
    },
    {
      step: '02',
      title: 'Execute Simulated Orders',
      desc: 'Place instant BUY or SELL market/limit orders with quantity presets and automatic validation.',
    },
    {
      step: '03',
      title: 'Track Realized & Unrealized P&L',
      desc: 'Monitor your portfolio holdings, calculate day returns, and refine trading strategies risk-free.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Paper Trading Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Trade Smarter. <br />
            <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Invest Better.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience the precision of professional Indian trading terminals. Practice simulated trading on top NSE/BSE stocks with ₹5,00,000 in virtual funds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/markets"
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-900 dark:text-white transition-all shadow-sm flex items-center gap-2"
            >
              <span>Explore Markets</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Zerodha & Groww Inspired</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>100% Risk-Free Simulation</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Live Local Calculations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Market Indices Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-6 mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Market Indices (Simulated)
          </h2>
          <Link
            href="/markets"
            className="text-xs text-blue-500 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>View All Markets</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_INDICES.map((idx) => (
            <MarketIndexCard key={idx.symbol} index={idx} />
          ))}
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-slate-100/60 dark:bg-navy-900/40 border-y border-slate-200 dark:border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Serious Traders
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Everything you need to analyze price action, place simulated trades, and master the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm hover:border-slate-300 dark:hover:border-navy-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.accent} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How TradeX Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Start paper trading in three straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-6 rounded-2xl bg-white dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 relative group"
            >
              <div className="text-4xl font-black font-mono text-blue-500/20 group-hover:text-blue-500/40 transition-colors mb-3">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>Launch Trading Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">TradeX</span>
            <span>&bull; Simulated Indian Stock Market Trading Terminal</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-500">
              Dashboard
            </Link>
            <Link href="/markets" className="hover:text-blue-500">
              Markets
            </Link>
            <Link href="/portfolio" className="hover:text-blue-500">
              Portfolio
            </Link>
            <Link href="/wallet" className="hover:text-blue-500">
              Virtual Wallet
            </Link>
          </div>

          <div className="text-center md:text-right">
            <span>Educational paper trading simulator only. No real funds involved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
