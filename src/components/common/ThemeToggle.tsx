'use client';

import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTrading();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-slate-400 hover:text-slate-100 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors border border-transparent dark:border-navy-700/60"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
