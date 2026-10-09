export type OrderType = 'MARKET' | 'LIMIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'EXECUTED' | 'OPEN' | 'CANCELLED';

export interface ChartPoint {
  time: string;
  price: number;
  volume?: number;
}

export interface StockHistory {
  '1D': ChartPoint[];
  '1W': ChartPoint[];
  '1M': ChartPoint[];
  '3M': ChartPoint[];
  '1Y': ChartPoint[];
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  description: string;
  history: StockHistory;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  history: ChartPoint[];
}

export interface Order {
  id: string;
  symbol: string;
  stockName: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price: number;
  total: number;
  status: OrderStatus;
  timestamp: string;
}

export interface Holding {
  symbol: string;
  stockName: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dayPnl: number;
}

export interface PortfolioSummary {
  totalValue: number;
  investedAmount: number;
  currentValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  todaysPnl: number;
  todaysPnlPercent: number;
  availableCash: number;
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  stocksCount: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
