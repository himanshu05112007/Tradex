import { Stock, MarketIndex, SectorPerformance, ChartPoint, StockHistory } from '@/types';

// Helper to generate realistic historical trend points
function generateHistory(basePrice: number, dailyChangePct: number): StockHistory {
  // 1D: intraday points from 09:15 to 15:30
  const times1D = ['09:15', '09:45', '10:30', '11:15', '12:00', '12:45', '13:30', '14:15', '15:00', '15:30'];
  const start1D = basePrice - (basePrice * (dailyChangePct / 100));
  const points1D: ChartPoint[] = times1D.map((time, idx) => {
    const progress = idx / (times1D.length - 1);
    const noise = (Math.sin(idx * 1.5) * 0.004) * basePrice;
    const interpolated = start1D + (basePrice - start1D) * progress + noise;
    return {
      time,
      price: Number((idx === times1D.length - 1 ? basePrice : interpolated).toFixed(2)),
    };
  });

  // 1W: 5 trading days
  const days1W = ['Mon', 'Tue', 'Wed', 'Thu', 'Today'];
  const start1W = basePrice * (1 - (dailyChangePct * 1.8) / 100);
  const points1W: ChartPoint[] = days1W.map((time, idx) => {
    const progress = idx / (days1W.length - 1);
    const noise = (Math.cos(idx * 2) * 0.008) * basePrice;
    const price = idx === days1W.length - 1 ? basePrice : start1W + (basePrice - start1W) * progress + noise;
    return { time, price: Number(price.toFixed(2)) };
  });

  // 1M: 4 weeks
  const weeks1M = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'];
  const start1M = basePrice * (1 - (dailyChangePct * 3.5) / 100);
  const points1M: ChartPoint[] = weeks1M.map((time, idx) => {
    const progress = idx / (weeks1M.length - 1);
    const noise = (Math.sin(idx * 3) * 0.015) * basePrice;
    const price = idx === weeks1M.length - 1 ? basePrice : start1M + (basePrice - start1M) * progress + noise;
    return { time, price: Number(price.toFixed(2)) };
  });

  // 3M: 3 months
  const months3M = ['3M Ago', '2.5M', '2M', '1.5M', '1M', '0.5M', 'Current'];
  const start3M = basePrice * 0.88;
  const points3M: ChartPoint[] = months3M.map((time, idx) => {
    const progress = idx / (months3M.length - 1);
    const wave = (Math.sin(idx * 1.2) * 0.03) * basePrice;
    const price = idx === months3M.length - 1 ? basePrice : start3M + (basePrice - start3M) * progress + wave;
    return { time, price: Number(price.toFixed(2)) };
  });

  // 1Y: 12 months
  const months1Y = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const start1Y = basePrice * 0.78;
  const points1Y: ChartPoint[] = months1Y.map((time, idx) => {
    const progress = idx / (months1Y.length - 1);
    const wave = (Math.sin(idx * 0.8) * 0.05) * basePrice;
    const price = idx === months1Y.length - 1 ? basePrice : start1Y + (basePrice - start1Y) * progress + wave;
    return { time, price: Number(price.toFixed(2)) };
  });

  return {
    '1D': points1D,
    '1W': points1W,
    '1M': points1M,
    '3M': points3M,
    '1Y': points1Y,
  };
}

export const INITIAL_STOCKS: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy & Petrochemicals',
    price: 2985.45,
    change: 42.15,
    changePercent: 1.43,
    open: 2950.00,
    high: 2998.00,
    low: 2942.30,
    prevClose: 2943.30,
    volume: '8.4M',
    marketCap: '₹20.19 Lakh Cr',
    peRatio: 28.4,
    dividendYield: 0.35,
    description: 'Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai. Its businesses include energy, petrochemicals, natural gas, retail, telecommunications, and mass media.',
    history: generateHistory(2985.45, 1.43)
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Information Technology',
    price: 4280.20,
    change: 65.80,
    changePercent: 1.56,
    open: 4220.00,
    high: 4295.00,
    low: 4210.50,
    prevClose: 4214.40,
    volume: '2.8M',
    marketCap: '₹15.48 Lakh Cr',
    peRatio: 32.1,
    dividendYield: 1.15,
    description: 'Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai, operating across 150 locations in 46 countries.',
    history: generateHistory(4280.20, 1.56)
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Information Technology',
    price: 1892.60,
    change: 28.40,
    changePercent: 1.52,
    open: 1870.00,
    high: 1902.50,
    low: 1864.00,
    prevClose: 1864.20,
    volume: '6.2M',
    marketCap: '₹7.86 Lakh Cr',
    peRatio: 29.8,
    dividendYield: 2.10,
    description: 'Infosys is a global leader in next-generation digital services and consulting, enabling clients across more than 50 countries to navigate their digital transformation.',
    history: generateHistory(1892.60, 1.52)
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking & Financials',
    price: 1642.10,
    change: -12.40,
    changePercent: -0.75,
    open: 1658.00,
    high: 1664.00,
    low: 1636.50,
    prevClose: 1654.50,
    volume: '14.1M',
    marketCap: '₹12.49 Lakh Cr',
    peRatio: 18.9,
    dividendYield: 1.18,
    description: 'HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai. It is India\'s largest private sector bank by assets and market capitalization.',
    history: generateHistory(1642.10, -0.75)
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking & Financials',
    price: 1228.75,
    change: 14.30,
    changePercent: 1.18,
    open: 1215.00,
    high: 1234.00,
    low: 1211.20,
    prevClose: 1214.45,
    volume: '11.5M',
    marketCap: '₹8.64 Lakh Cr',
    peRatio: 17.6,
    dividendYield: 0.81,
    description: 'ICICI Bank is a leading Indian multinational bank offering a wide range of banking products and financial services for corporate and retail customers through a variety of delivery channels.',
    history: generateHistory(1228.75, 1.18)
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecommunications',
    price: 1684.90,
    change: 22.80,
    changePercent: 1.37,
    open: 1665.00,
    high: 1692.00,
    low: 1660.00,
    prevClose: 1662.10,
    volume: '4.9M',
    marketCap: '₹9.82 Lakh Cr',
    peRatio: 58.2,
    dividendYield: 0.48,
    description: 'Bharti Airtel Limited is a leading global telecommunications company with operations in 18 countries across Asia and Africa, ranking among the top three mobile service providers globally.',
    history: generateHistory(1684.90, 1.37)
  },
  {
    symbol: 'ITC',
    name: 'ITC Limited',
    sector: 'Consumer Goods (FMCG)',
    price: 512.30,
    change: -3.85,
    changePercent: -0.74,
    open: 517.00,
    high: 518.50,
    low: 510.10,
    prevClose: 516.15,
    volume: '9.8M',
    marketCap: '₹6.39 Lakh Cr',
    peRatio: 27.2,
    dividendYield: 2.74,
    description: 'ITC Limited is an Indian conglomerate company headquartered in Kolkata. Its diversified presence spans across FMCG, hotels, packaging, paperboards, specialty papers, and agribusiness.',
    history: generateHistory(512.30, -0.74)
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Limited',
    sector: 'Information Technology',
    price: 546.80,
    change: 8.65,
    changePercent: 1.61,
    open: 539.00,
    high: 549.40,
    low: 537.10,
    prevClose: 538.15,
    volume: '5.1M',
    marketCap: '₹2.86 Lakh Cr',
    peRatio: 24.8,
    dividendYield: 0.19,
    description: 'Wipro Limited is a leading technology services and consulting company focused on building innovative solutions that address clients\' most complex digital transformation needs.',
    history: generateHistory(546.80, 1.61)
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Automobile',
    price: 978.40,
    change: -14.60,
    changePercent: -1.47,
    open: 994.00,
    high: 998.00,
    low: 974.50,
    prevClose: 993.00,
    volume: '10.3M',
    marketCap: '₹3.60 Lakh Cr',
    peRatio: 10.4,
    dividendYield: 0.61,
    description: 'Tata Motors Limited is a leading global automobile manufacturer of cars, utility vehicles, pick-ups, trucks and buses, as well as the parent company of Jaguar Land Rover.',
    history: generateHistory(978.40, -1.47)
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd',
    sector: 'Engineering & Construction',
    price: 3640.00,
    change: 48.90,
    changePercent: 1.36,
    open: 3600.00,
    high: 3662.00,
    low: 3590.00,
    prevClose: 3591.10,
    volume: '2.1M',
    marketCap: '₹5.01 Lakh Cr',
    peRatio: 37.1,
    dividendYield: 0.77,
    description: 'Larsen & Toubro is an Indian multinational conglomerate engaged in EPC projects, hi-tech manufacturing, and services across heavy civil infrastructure, energy, defense, and IT.',
    history: generateHistory(3640.00, 1.36)
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking & Financials',
    price: 814.50,
    change: 7.20,
    changePercent: 0.89,
    open: 809.00,
    high: 819.30,
    low: 806.00,
    prevClose: 807.30,
    volume: '18.4M',
    marketCap: '₹7.27 Lakh Cr',
    peRatio: 11.2,
    dividendYield: 1.68,
    description: 'State Bank of India is a Fortune 500 company and India\'s largest public sector banking and financial services statutory body, serving over 480 million customers.',
    history: generateHistory(814.50, 0.89)
  },
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd',
    sector: 'Consumer Goods (FMCG)',
    price: 2780.00,
    change: -18.50,
    changePercent: -0.66,
    open: 2805.00,
    high: 2814.00,
    low: 2772.00,
    prevClose: 2798.50,
    volume: '1.9M',
    marketCap: '₹6.53 Lakh Cr',
    peRatio: 63.4,
    dividendYield: 1.51,
    description: 'Hindustan Unilever Limited is India\'s largest fast-moving consumer goods company with a heritage of over 90 years in India, delivering everyday essentials to 9 out of 10 households.',
    history: generateHistory(2780.00, -0.66)
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd',
    sector: 'Banking & Financials',
    price: 7340.00,
    change: 115.00,
    changePercent: 1.59,
    open: 7240.00,
    high: 7380.00,
    low: 7215.00,
    prevClose: 7225.00,
    volume: '1.4M',
    marketCap: '₹4.54 Lakh Cr',
    peRatio: 31.8,
    dividendYield: 0.49,
    description: 'Bajaj Finance Limited is one of the most diversified NBFCs in the Indian market, catering to over 83 million customers across lending, deposits, and payments.',
    history: generateHistory(7340.00, 1.59)
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd',
    sector: 'Automobile',
    price: 12450.00,
    change: 180.00,
    changePercent: 1.47,
    open: 12300.00,
    high: 12510.00,
    low: 12280.00,
    prevClose: 12270.00,
    volume: '0.6M',
    marketCap: '₹3.91 Lakh Cr',
    peRatio: 29.5,
    dividendYield: 1.00,
    description: 'Maruti Suzuki India Limited is India\'s largest passenger vehicle automaker, holding roughly 42% market share of the Indian passenger car market.',
    history: generateHistory(12450.00, 1.47)
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Ind Ltd',
    sector: 'Healthcare & Pharma',
    price: 1875.00,
    change: 12.50,
    changePercent: 0.67,
    open: 1865.00,
    high: 1888.00,
    low: 1858.00,
    prevClose: 1862.50,
    volume: '2.5M',
    marketCap: '₹4.50 Lakh Cr',
    peRatio: 41.2,
    dividendYield: 0.72,
    description: 'Sun Pharma is the fourth largest specialty generic pharmaceutical company in the world and India\'s top pharma company, supplying high-quality, affordable medicines in over 100 countries.',
    history: generateHistory(1875.00, 0.67)
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd',
    sector: 'Consumer Goods (FMCG)',
    price: 3520.00,
    change: -26.00,
    changePercent: -0.73,
    open: 3550.00,
    high: 3565.00,
    low: 3505.00,
    prevClose: 3546.00,
    volume: '1.2M',
    marketCap: '₹3.12 Lakh Cr',
    peRatio: 88.4,
    dividendYield: 0.31,
    description: 'Titan Company Limited is an Indian luxury fashion company known for jewelry (Tanishq), watches (Titan, Fastrack), eyewear (Titan EyePlus), and fragrance brands.',
    history: generateHistory(3520.00, -0.73)
  },
  {
    symbol: 'ADANIENT',
    name: 'Adani Enterprises Ltd',
    sector: 'Conglomerate & Mining',
    price: 3120.50,
    change: 54.50,
    changePercent: 1.78,
    open: 3080.00,
    high: 3145.00,
    low: 3070.00,
    prevClose: 3066.00,
    volume: '3.7M',
    marketCap: '₹3.55 Lakh Cr',
    peRatio: 82.5,
    dividendYield: 0.04,
    description: 'Adani Enterprises is the flagship company of Adani Group, incubating infrastructure businesses across green hydrogen, airports, data centers, roads, and solar manufacturing.',
    history: generateHistory(3120.50, 1.78)
  },
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd',
    sector: 'Metals & Mining',
    price: 162.40,
    change: 2.85,
    changePercent: 1.79,
    open: 160.00,
    high: 163.50,
    low: 159.20,
    prevClose: 159.55,
    volume: '32.1M',
    marketCap: '₹2.03 Lakh Cr',
    peRatio: 48.0,
    dividendYield: 2.21,
    description: 'Tata Steel Limited is one of the top global steel companies with annual crude steel capacity of 35 million tonnes per annum, operating across India, the UK, and the Netherlands.',
    history: generateHistory(162.40, 1.79)
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank',
    sector: 'Banking & Financials',
    price: 1810.00,
    change: -9.50,
    changePercent: -0.52,
    open: 1825.00,
    high: 1832.00,
    low: 1802.00,
    prevClose: 1819.50,
    volume: '3.9M',
    marketCap: '₹3.60 Lakh Cr',
    peRatio: 21.4,
    dividendYield: 0.11,
    description: 'Kotak Mahindra Bank is a premier Indian financial services group offering banking products and financial services including commercial banking, stock broking, and asset management.',
    history: generateHistory(1810.00, -0.52)
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd',
    sector: 'Consumer Goods (FMCG)',
    price: 3120.00,
    change: 18.00,
    changePercent: 0.58,
    open: 3105.00,
    high: 3135.00,
    low: 3098.00,
    prevClose: 3102.00,
    volume: '1.6M',
    marketCap: '₹2.99 Lakh Cr',
    peRatio: 52.8,
    dividendYield: 1.07,
    description: 'Asian Paints is India\'s leading paint company and ranked among top ten decorative coatings companies globally, operating in 15 countries with 27 paint manufacturing facilities.',
    history: generateHistory(3120.00, 0.58)
  }
];

export const MARKET_INDICES: MarketIndex[] = [
  {
    symbol: 'NIFTY50',
    name: 'NIFTY 50',
    value: 24852.15,
    change: 142.30,
    changePercent: 0.58,
    history: [
      { time: '09:15', price: 24715 },
      { time: '10:30', price: 24760 },
      { time: '11:45', price: 24740 },
      { time: '13:00', price: 24810 },
      { time: '14:15', price: 24835 },
      { time: '15:30', price: 24852.15 },
    ]
  },
  {
    symbol: 'SENSEX',
    name: 'SENSEX',
    value: 81385.40,
    change: 425.10,
    changePercent: 0.53,
    history: [
      { time: '09:15', price: 80970 },
      { time: '10:30', price: 81120 },
      { time: '11:45', price: 81060 },
      { time: '13:00', price: 81290 },
      { time: '14:15', price: 81340 },
      { time: '15:30', price: 81385.40 },
    ]
  },
  {
    symbol: 'BANKNIFTY',
    name: 'BANK NIFTY',
    value: 51420.80,
    change: -110.25,
    changePercent: -0.21,
    history: [
      { time: '09:15', price: 51535 },
      { time: '10:30', price: 51490 },
      { time: '11:45', price: 51380 },
      { time: '13:00', price: 51450 },
      { time: '14:15', price: 51410 },
      { time: '15:30', price: 51420.80 },
    ]
  },
  {
    symbol: 'NIFTYIT',
    name: 'NIFTY IT',
    value: 42110.50,
    change: 390.60,
    changePercent: 0.94,
    history: [
      { time: '09:15', price: 41730 },
      { time: '10:30', price: 41890 },
      { time: '11:45', price: 41950 },
      { time: '13:00', price: 42050 },
      { time: '14:15', price: 42080 },
      { time: '15:30', price: 42110.50 },
    ]
  }
];

export const SECTOR_PERFORMANCE: SectorPerformance[] = [
  { name: 'Information Technology', changePercent: 1.45, stocksCount: 3 },
  { name: 'Energy & Petrochem', changePercent: 1.43, stocksCount: 1 },
  { name: 'Metals & Mining', changePercent: 1.79, stocksCount: 1 },
  { name: 'Telecommunications', changePercent: 1.37, stocksCount: 1 },
  { name: 'Automobile', changePercent: 0.52, stocksCount: 2 },
  { name: 'Healthcare & Pharma', changePercent: 0.67, stocksCount: 1 },
  { name: 'Banking & Financials', changePercent: 0.48, stocksCount: 5 },
  { name: 'Consumer Goods (FMCG)', changePercent: -0.38, stocksCount: 4 },
];
