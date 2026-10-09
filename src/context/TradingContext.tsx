'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Stock, Order, Holding, PortfolioSummary, ToastMessage, OrderSide, OrderType } from '@/types';
import { INITIAL_STOCKS } from '@/data/stocks';

interface TradeModalConfig {
  isOpen: boolean;
  stock: Stock | null;
  side: OrderSide;
}

interface TradingContextType {
  stocks: Stock[];
  watchlist: string[];
  orders: Order[];
  holdings: Holding[];
  balance: number;
  theme: 'dark' | 'light';
  toasts: ToastMessage[];
  portfolioSummary: PortfolioSummary;
  tradeModal: TradeModalConfig;
  toggleWatchlist: (symbol: string) => void;
  isWatchlisted: (symbol: string) => boolean;
  placeOrder: (params: {
    symbol: string;
    stockName: string;
    type: OrderType;
    side: OrderSide;
    quantity: number;
    price: number;
  }) => { success: boolean; message: string };
  cancelOrder: (orderId: string) => void;
  addFunds: (amount: number) => void;
  resetDemoData: () => void;
  toggleTheme: () => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  openTradeModal: (stock: Stock, side?: OrderSide) => void;
  closeTradeModal: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const DEFAULT_WATCHLIST = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TATAMOTORS'];
const DEFAULT_INITIAL_BALANCE = 500000; // ₹5,00,000

const INITIAL_DEMO_HOLDINGS: Holding[] = [
  {
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd',
    quantity: 20,
    avgBuyPrice: 2890.00,
    currentPrice: 2985.45,
    investedValue: 57800.00,
    currentValue: 59709.00,
    pnl: 1909.00,
    pnlPercent: 3.30,
    dayPnl: 843.00,
  },
  {
    symbol: 'TCS',
    stockName: 'Tata Consultancy Services',
    quantity: 15,
    avgBuyPrice: 4120.00,
    currentPrice: 4280.20,
    investedValue: 61800.00,
    currentValue: 64203.00,
    pnl: 2403.00,
    pnlPercent: 3.89,
    dayPnl: 987.00,
  },
  {
    symbol: 'INFY',
    stockName: 'Infosys Limited',
    quantity: 40,
    avgBuyPrice: 1810.00,
    currentPrice: 1892.60,
    investedValue: 72400.00,
    currentValue: 75704.00,
    pnl: 3304.00,
    pnlPercent: 4.56,
    dayPnl: 1136.00,
  },
  {
    symbol: 'TATAMOTORS',
    stockName: 'Tata Motors Ltd',
    quantity: 35,
    avgBuyPrice: 995.00,
    currentPrice: 978.40,
    investedValue: 34825.00,
    currentValue: 34244.00,
    pnl: -581.00,
    pnlPercent: -1.67,
    dayPnl: -511.00,
  }
];

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'TX-10928',
    symbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd',
    type: 'MARKET',
    side: 'BUY',
    quantity: 20,
    price: 2890.00,
    total: 57800.00,
    status: 'EXECUTED',
    timestamp: '2026-10-08 10:14 AM'
  },
  {
    id: 'TX-10927',
    symbol: 'TCS',
    stockName: 'Tata Consultancy Services',
    type: 'LIMIT',
    side: 'BUY',
    quantity: 15,
    price: 4120.00,
    total: 61800.00,
    status: 'EXECUTED',
    timestamp: '2026-10-07 02:45 PM'
  },
  {
    id: 'TX-10926',
    symbol: 'INFY',
    stockName: 'Infosys Limited',
    type: 'MARKET',
    side: 'BUY',
    quantity: 40,
    price: 1810.00,
    total: 72400.00,
    status: 'EXECUTED',
    timestamp: '2026-10-06 11:30 AM'
  },
  {
    id: 'TX-10925',
    symbol: 'TATAMOTORS',
    stockName: 'Tata Motors Ltd',
    type: 'MARKET',
    side: 'BUY',
    quantity: 35,
    price: 995.00,
    total: 34825.00,
    status: 'EXECUTED',
    timestamp: '2026-10-05 01:15 PM'
  }
];

export function TradingProvider({ children }: { children: ReactNode }) {
  const [stocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [watchlist, setWatchlist] = useState<string[]>(DEFAULT_WATCHLIST);
  const [balance, setBalance] = useState<number>(DEFAULT_INITIAL_BALANCE - (57800 + 61800 + 72400 + 34825));
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_DEMO_HOLDINGS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [tradeModal, setTradeModal] = useState<TradeModalConfig>({
    isOpen: false,
    stock: null,
    side: 'BUY',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('tradex_watchlist');
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));

      const storedBalance = localStorage.getItem('tradex_balance');
      if (storedBalance) setBalance(Number(storedBalance));

      const storedHoldings = localStorage.getItem('tradex_holdings');
      if (storedHoldings) setHoldings(JSON.parse(storedHoldings));

      const storedOrders = localStorage.getItem('tradex_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedTheme = localStorage.getItem('tradex_theme') as 'dark' | 'light';
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch {
      // Fallback to default state
    }
    setIsLoaded(true);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('tradex_watchlist', JSON.stringify(watchlist));
      localStorage.setItem('tradex_balance', balance.toString());
      localStorage.setItem('tradex_holdings', JSON.stringify(holdings));
      localStorage.setItem('tradex_orders', JSON.stringify(orders));
      localStorage.setItem('tradex_theme', theme);
    } catch {
      // Ignore write errors
    }
  }, [watchlist, balance, holdings, orders, theme, isLoaded]);

  // Apply theme class to <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev => {
      const exists = prev.includes(symbol);
      if (exists) {
        showToast('Watchlist Updated', `Removed ${symbol} from your watchlist`, 'info');
        return prev.filter(s => s !== symbol);
      } else {
        showToast('Watchlist Updated', `Added ${symbol} to your watchlist`, 'success');
        return [...prev, symbol];
      }
    });
  };

  const isWatchlisted = (symbol: string) => watchlist.includes(symbol);

  // Recalculate holdings with updated stock market prices
  const updatedHoldings = useMemo(() => {
    return holdings.map(h => {
      const liveStock = stocks.find(s => s.symbol === h.symbol);
      const curPrice = liveStock ? liveStock.price : h.currentPrice;
      const curVal = h.quantity * curPrice;
      const invVal = h.quantity * h.avgBuyPrice;
      const pnl = curVal - invVal;
      const pnlPct = invVal > 0 ? (pnl / invVal) * 100 : 0;
      const dayPnl = liveStock ? liveStock.change * h.quantity : 0;

      return {
        ...h,
        currentPrice: curPrice,
        investedValue: Number(invVal.toFixed(2)),
        currentValue: Number(curVal.toFixed(2)),
        pnl: Number(pnl.toFixed(2)),
        pnlPercent: Number(pnlPct.toFixed(2)),
        dayPnl: Number(dayPnl.toFixed(2)),
      };
    });
  }, [holdings, stocks]);

  // Derived Portfolio Summary
  const portfolioSummary: PortfolioSummary = useMemo(() => {
    const investedAmount = updatedHoldings.reduce((sum, h) => sum + h.investedValue, 0);
    const currentValue = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalPnl = currentValue - investedAmount;
    const totalPnlPercent = investedAmount > 0 ? (totalPnl / investedAmount) * 100 : 0;
    const todaysPnl = updatedHoldings.reduce((sum, h) => sum + h.dayPnl, 0);
    const todaysPnlPercent = investedAmount > 0 ? (todaysPnl / investedAmount) * 100 : 0;
    const totalValue = currentValue + balance;

    return {
      totalValue: Number(totalValue.toFixed(2)),
      investedAmount: Number(investedAmount.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      totalPnl: Number(totalPnl.toFixed(2)),
      totalPnlPercent: Number(totalPnlPercent.toFixed(2)),
      todaysPnl: Number(todaysPnl.toFixed(2)),
      todaysPnlPercent: Number(todaysPnlPercent.toFixed(2)),
      availableCash: Number(balance.toFixed(2)),
    };
  }, [updatedHoldings, balance]);

  const placeOrder = ({
    symbol,
    stockName,
    type,
    side,
    quantity,
    price,
  }: {
    symbol: string;
    stockName: string;
    type: OrderType;
    side: OrderSide;
    quantity: number;
    price: number;
  }): { success: boolean; message: string } => {
    if (quantity <= 0) {
      const err = 'Quantity must be at least 1 share.';
      showToast('Order Failed', err, 'error');
      return { success: false, message: err };
    }

    const total = quantity * price;

    if (side === 'BUY') {
      if (total > balance) {
        const err = `Insufficient virtual balance! Required ₹${total.toLocaleString('en-IN')}, available ₹${balance.toLocaleString('en-IN')}.`;
        showToast('Insufficient Funds', err, 'error');
        return { success: false, message: err };
      }

      // Deduct balance
      setBalance(prev => prev - total);

      // Update holdings
      setHoldings(prev => {
        const existingIdx = prev.findIndex(h => h.symbol === symbol);
        if (existingIdx >= 0) {
          const current = prev[existingIdx];
          const newQty = current.quantity + quantity;
          const newInvested = current.investedValue + total;
          const newAvg = newInvested / newQty;
          const liveStock = stocks.find(s => s.symbol === symbol);
          const curPrice = liveStock ? liveStock.price : price;
          const newCurVal = newQty * curPrice;
          const newPnl = newCurVal - newInvested;

          const updated = [...prev];
          updated[existingIdx] = {
            ...current,
            quantity: newQty,
            avgBuyPrice: Number(newAvg.toFixed(2)),
            investedValue: Number(newInvested.toFixed(2)),
            currentPrice: curPrice,
            currentValue: Number(newCurVal.toFixed(2)),
            pnl: Number(newPnl.toFixed(2)),
            pnlPercent: Number(((newPnl / newInvested) * 100).toFixed(2)),
            dayPnl: liveStock ? liveStock.change * newQty : 0,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              symbol,
              stockName,
              quantity,
              avgBuyPrice: price,
              currentPrice: price,
              investedValue: total,
              currentValue: total,
              pnl: 0,
              pnlPercent: 0,
              dayPnl: 0,
            }
          ];
        }
      });

      const newOrder: Order = {
        id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
        symbol,
        stockName,
        type,
        side,
        quantity,
        price,
        total,
        status: 'EXECUTED',
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setOrders(prev => [newOrder, ...prev]);
      showToast('Order Executed', `Bought ${quantity} shares of ${symbol} at ₹${price.toFixed(2)}`, 'success');
      return { success: true, message: 'Order executed successfully!' };
    } else {
      // SELL ORDER
      const holding = holdings.find(h => h.symbol === symbol);
      if (!holding || holding.quantity < quantity) {
        const owned = holding ? holding.quantity : 0;
        const err = `Cannot sell ${quantity} shares. You currently own ${owned} shares of ${symbol}.`;
        showToast('Sale Rejected', err, 'error');
        return { success: false, message: err };
      }

      // Add proceeds to balance
      setBalance(prev => prev + total);

      // Update holdings
      setHoldings(prev => {
        const existingIdx = prev.findIndex(h => h.symbol === symbol);
        const current = prev[existingIdx];
        const remainingQty = current.quantity - quantity;

        if (remainingQty <= 0) {
          // completely liquidated
          return prev.filter(h => h.symbol !== symbol);
        }

        const newInvested = remainingQty * current.avgBuyPrice;
        const liveStock = stocks.find(s => s.symbol === symbol);
        const curPrice = liveStock ? liveStock.price : price;
        const newCurVal = remainingQty * curPrice;
        const newPnl = newCurVal - newInvested;

        const updated = [...prev];
        updated[existingIdx] = {
          ...current,
          quantity: remainingQty,
          investedValue: Number(newInvested.toFixed(2)),
          currentValue: Number(newCurVal.toFixed(2)),
          pnl: Number(newPnl.toFixed(2)),
          pnlPercent: Number(((newPnl / newInvested) * 100).toFixed(2)),
          dayPnl: liveStock ? liveStock.change * remainingQty : 0,
        };
        return updated;
      });

      const newOrder: Order = {
        id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
        symbol,
        stockName,
        type,
        side,
        quantity,
        price,
        total,
        status: 'EXECUTED',
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setOrders(prev => [newOrder, ...prev]);
      showToast('Order Executed', `Sold ${quantity} shares of ${symbol} at ₹${price.toFixed(2)}`, 'success');
      return { success: true, message: 'Sell order executed successfully!' };
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );
    showToast('Order Cancelled', `Order #${orderId} was cancelled`, 'info');
  };

  const addFunds = (amount: number) => {
    if (amount <= 0) return;
    setBalance(prev => prev + amount);
    showToast('Funds Deposited', `Added ₹${amount.toLocaleString('en-IN')} virtual cash to your wallet.`, 'success');
  };

  const resetDemoData = () => {
    setWatchlist(DEFAULT_WATCHLIST);
    setBalance(DEFAULT_INITIAL_BALANCE - (57800 + 61800 + 72400 + 34825));
    setHoldings(INITIAL_DEMO_HOLDINGS);
    setOrders(INITIAL_DEMO_ORDERS);
    showToast('Reset Complete', 'Simulated trading environment restored to default data.', 'info');
  };

  const openTradeModal = (stock: Stock, side: OrderSide = 'BUY') => {
    setTradeModal({
      isOpen: true,
      stock,
      side,
    });
  };

  const closeTradeModal = () => {
    setTradeModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <TradingContext.Provider
      value={{
        stocks,
        watchlist,
        orders,
        holdings: updatedHoldings,
        balance,
        theme,
        toasts,
        portfolioSummary,
        tradeModal,
        toggleWatchlist,
        isWatchlisted,
        placeOrder,
        cancelOrder,
        addFunds,
        resetDemoData,
        toggleTheme,
        showToast,
        removeToast,
        openTradeModal,
        closeTradeModal,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
