
import { toast } from "@/hooks/use-toast";

// Mock cryptocurrency data
export interface CandleData {
  time: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

// Available trading pairs
export const tradingPairs = [
  { symbol: 'BINANCE:BTCUSDT', name: 'BTC/USDT', exchange: 'Binance' },
  { symbol: 'BINANCE:ETHUSDT', name: 'ETH/USDT', exchange: 'Binance' },
  { symbol: 'BINANCE:SOLUSDT', name: 'SOL/USDT', exchange: 'Binance' },
  { symbol: 'BINANCE:DOGEUSDT', name: 'DOGE/USDT', exchange: 'Binance' },
];

// Available indicators with TradingView study names
export const availableIndicators = [
  { id: 'rsi', name: 'RSI', category: 'momentum', tvStudy: 'RSI@tv-basicstudies' },
  { id: 'macd', name: 'MACD', category: 'momentum', tvStudy: 'MACD@tv-basicstudies' },
  { id: 'bb', name: 'Bollinger Bands', category: 'volatility', tvStudy: 'BB@tv-basicstudies' },
  { id: 'ma', name: 'Moving Average', category: 'trend', tvStudy: 'MASimple@tv-basicstudies' },
  { id: 'ema', name: 'EMA', category: 'trend', tvStudy: 'MAExp@tv-basicstudies' },
  { id: 'ichimoku', name: 'Ichimoku Cloud', category: 'trend', tvStudy: 'IchimokuCloud@tv-basicstudies' },
  { id: 'stoch', name: 'Stochastic', category: 'momentum', tvStudy: 'Stochastic@tv-basicstudies' },
  { id: 'volume', name: '24-hour Volume', category: 'volume', tvStudy: 'Volume@tv-basicstudies' },
  { id: 'adl', name: 'Accumulation/Distribution', category: 'volume', tvStudy: 'AccumulationDistribution@tv-basicstudies' },
  { id: 'adline', name: 'Advance Decline Line', category: 'breadth', tvStudy: 'AdvanceDeclineLine@tv-basicstudies' },
  { id: 'adr', name: 'Advance Decline Ratio', category: 'breadth', tvStudy: 'AdvanceDeclineRatio@tv-basicstudies' },
  { id: 'adrbars', name: 'Advance/Decline Ratio (Bars)', category: 'breadth', tvStudy: 'AdvanceDeclineRatioBars@tv-basicstudies' },
  { id: 'arnaud', name: 'Arnaud Legoux Moving Average', category: 'trend', tvStudy: 'ALMA@tv-basicstudies' },
  { id: 'aroon', name: 'Aroon', category: 'trend', tvStudy: 'AroonOscillator@tv-basicstudies' },
  { id: 'avgdayrange', name: 'Average Day Range', category: 'volatility', tvStudy: 'AverageDayRange@tv-basicstudies' },
  { id: 'adi', name: 'Average Directional Index', category: 'trend', tvStudy: 'ADI@tv-basicstudies' },
  { id: 'atr', name: 'Average True Range', category: 'volatility', tvStudy: 'ATR@tv-basicstudies' },
  { id: 'awesome', name: 'Awesome Oscillator', category: 'momentum', tvStudy: 'AwesomeOscillator@tv-basicstudies' },
  { id: 'bop', name: 'Balance of Power', category: 'momentum', tvStudy: 'BalanceOfPower@tv-basicstudies' },
  { id: 'bbtrend', name: 'BBTrend', category: 'trend', tvStudy: 'BBTrend@tv-basicstudies' },
];

// Function to get an indicator by ID or name (case insensitive)
export const getIndicatorByIdOrName = (searchTerm: string): any => {
  if (!searchTerm) return null;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  // Try to find by ID first
  let indicator = availableIndicators.find(ind => ind.id === normalizedSearch);
  
  // If not found by ID, try to find by name (partial match)
  if (!indicator) {
    indicator = availableIndicators.find(ind => 
      ind.name.toLowerCase().includes(normalizedSearch)
    );
  }
  
  return indicator;
};

// Function to add an indicator to the chart
export const addIndicatorToChart = async (widget: any, indicatorId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Find the indicator in our available list
      const indicator = getIndicatorByIdOrName(indicatorId);
      if (!indicator) {
        toast({
          title: 'Error',
          description: `Indicator ${indicatorId} not found`,
          variant: 'destructive'
        });
        resolve(false);
        return;
      }

      console.log(`Adding indicator: ${indicator.name} (${indicator.tvStudy})`);

      // In a real implementation, this would use TradingView's API
      // For simulation, we can't actually modify the widget, but we'll simulate success
      setTimeout(() => {
        toast({
          title: 'Indicator Added',
          description: `${indicator.name} added to chart`
        });
        resolve(true);
      }, 500);
    } catch (error) {
      console.error('Error adding indicator:', error);
      toast({
        title: 'Error',
        description: `Failed to add indicator: ${error}`,
        variant: 'destructive'
      });
      resolve(false);
    }
  });
};

// Function to remove an indicator from the chart
export const removeIndicatorFromChart = async (widget: any, indicatorId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Find the indicator in our available list
      const indicator = getIndicatorByIdOrName(indicatorId);
      if (!indicator) {
        toast({
          title: 'Error',
          description: `Indicator ${indicatorId} not found`,
          variant: 'destructive'
        });
        resolve(false);
        return;
      }

      console.log(`Removing indicator: ${indicator.name} (${indicator.tvStudy})`);

      // In a real implementation, this would use TradingView's API
      // For simulation, we can't actually modify the widget, but we'll simulate success
      setTimeout(() => {
        toast({
          title: 'Indicator Removed',
          description: `${indicator.name} removed from chart`
        });
        resolve(true);
      }, 500);
    } catch (error) {
      console.error('Error removing indicator:', error);
      toast({
        title: 'Error',
        description: `Failed to remove indicator: ${error}`,
        variant: 'destructive'
      });
      resolve(false);
    }
  });
};

// Function to change the trading pair
export const changeTradingPair = (symbol: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // In a real implementation, this would update the TradingView widget
      // For now, we'll simulate success
      setTimeout(() => {
        toast({
          title: 'Trading Pair Changed',
          description: `Chart updated to ${symbol}`
        });
        resolve(true);
      }, 500);
    } catch (error) {
      console.error('Error changing trading pair:', error);
      resolve(false);
    }
  });
};
