import axios from "axios";

// API endpoints
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY || "";
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "";

// Base URLs
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Interfaces
export interface StockQuote {
  c: number; // Current price
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

export interface StockCandle {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  s: string; // Status
  t: number[]; // Timestamps
  v: number[]; // Volumes
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Helper function to format date for API requests
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Get current stock quote
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error("Finnhub API key is missing");
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol,
        token: FINNHUB_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    // Return mock data if API fails
    return {
      c: 173.45,
      h: 175.1,
      l: 172.3,
      o: 172.5,
      pc: 171.2,
      t: Date.now(),
    };
  }
};

// Get historical stock data
export const getStockCandles = async (
  symbol: string,
  resolution: string,
  from: number,
  to: number,
): Promise<StockCandle> => {
  try {
    if (!FINNHUB_API_KEY) {
      throw new Error("Finnhub API key is missing");
    }

    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/candle`, {
      params: {
        symbol,
        resolution,
        from,
        to,
        token: FINNHUB_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching stock candles:", error);
    // Generate mock data if API fails
    const mockLength = 30;
    const mockData: StockCandle = {
      c: [],
      h: [],
      l: [],
      o: [],
      s: "ok",
      t: [],
      v: [],
    };

    const basePrice = 150;
    const now = Date.now();
    const dayInMs = 86400000;

    for (let i = 0; i < mockLength; i++) {
      const timestamp = now - (mockLength - i) * dayInMs;
      const open = basePrice + Math.random() * 10;
      const close = open + (Math.random() * 10 - 5);
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
      const volume = Math.floor(Math.random() * 10000000) + 1000000;

      mockData.t.push(Math.floor(timestamp / 1000));
      mockData.o.push(open);
      mockData.c.push(close);
      mockData.h.push(high);
      mockData.l.push(low);
      mockData.v.push(volume);
    }

    return mockData;
  }
};

// Get time series data from Alpha Vantage (alternative source)
export const getTimeSeriesData = async (
  symbol: string,
  timeframe: string,
): Promise<TimeSeriesData[]> => {
  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error("Alpha Vantage API key is missing");
    }

    // Determine the function based on timeframe
    let function_name = "TIME_SERIES_DAILY";
    if (timeframe === "1D" || timeframe === "1W") {
      function_name = "TIME_SERIES_INTRADAY";
    } else if (timeframe === "1M" || timeframe === "3M") {
      function_name = "TIME_SERIES_DAILY";
    } else {
      function_name = "TIME_SERIES_WEEKLY";
    }

    // Set interval for intraday data
    const interval = timeframe === "1D" ? "5min" : "60min";

    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: function_name,
        symbol,
        interval: interval,
        outputsize: "compact",
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    // Parse the response based on the function used
    const data = response.data;
    const timeSeriesKey = Object.keys(data).find((key) =>
      key.includes("Time Series"),
    );

    if (!timeSeriesKey) {
      throw new Error("Invalid response format");
    }

    const timeSeries = data[timeSeriesKey];
    const result: TimeSeriesData[] = [];

    for (const date in timeSeries) {
      const entry = timeSeries[date];
      result.push({
        date,
        open: parseFloat(entry["1. open"]),
        high: parseFloat(entry["2. high"]),
        low: parseFloat(entry["3. low"]),
        close: parseFloat(entry["4. close"]),
        volume: parseInt(entry["5. volume"], 10),
      });
    }

    return result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  } catch (error) {
    console.error("Error fetching time series data:", error);
    // Return mock data if API fails
    return generateMockTimeSeriesData(timeframe);
  }
};

// Generate mock time series data
const generateMockTimeSeriesData = (timeframe: string): TimeSeriesData[] => {
  const result: TimeSeriesData[] = [];
  const today = new Date();
  let dataPoints = 30;

  switch (timeframe) {
    case "1D":
      dataPoints = 24;
      break;
    case "1W":
      dataPoints = 7;
      break;
    case "1M":
      dataPoints = 30;
      break;
    case "3M":
      dataPoints = 90;
      break;
    case "6M":
      dataPoints = 180;
      break;
    case "1Y":
      dataPoints = 365;
      break;
    case "5Y":
      dataPoints = 260; // Trading days in 5 years (approx)
      break;
    default:
      dataPoints = 30;
  }

  const basePrice = 150;
  let currentPrice = basePrice;

  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date(today);

    if (timeframe === "1D") {
      date.setHours(today.getHours() - i);
    } else {
      date.setDate(today.getDate() - i);
    }

    // Create some price movement
    const change = (Math.random() - 0.5) * 5;
    currentPrice += change;
    currentPrice = Math.max(currentPrice, basePrice * 0.7); // Prevent going too low

    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * 3;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.floor(Math.random() * 10000000) + 1000000;

    result.push({
      date: formatDate(date),
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return result;
};

// Calculate DEMA (Double Exponential Moving Average)
export const calculateDEMA = (prices: number[], period: number): number[] => {
  if (prices.length < period) {
    return prices.map(() => 0);
  }

  // Calculate first EMA
  const ema1 = calculateEMA(prices, period);

  // Calculate second EMA (EMA of EMA)
  const ema2 = calculateEMA(ema1, period);

  // Calculate DEMA: 2 * EMA1 - EMA2
  return ema1.map((value, index) => 2 * value - ema2[index]);
};

// Calculate EMA (Exponential Moving Average)
const calculateEMA = (prices: number[], period: number): number[] => {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);

  // Initialize with SMA
  let sma = 0;
  for (let i = 0; i < period; i++) {
    sma += prices[i];
  }
  sma /= period;

  result.push(sma);

  // Calculate EMA for the rest
  for (let i = period; i < prices.length; i++) {
    const ema =
      (prices[i] - result[result.length - 1]) * multiplier +
      result[result.length - 1];
    result.push(ema);
  }

  // Pad the beginning with zeros to match input length
  const padding = new Array(prices.length - result.length).fill(0);
  return [...padding, ...result];
};

// Identify support and resistance levels
export const identifySupportResistanceLevels = (
  prices: number[],
  sensitivity: number,
  lookbackPeriod: number,
): { support: number[]; resistance: number[] } => {
  if (prices.length < lookbackPeriod) {
    return { support: [], resistance: [] };
  }

  const support: number[] = [];
  const resistance: number[] = [];
  const threshold = sensitivity / 100;

  // Find local minima and maxima
  for (let i = lookbackPeriod; i < prices.length - lookbackPeriod; i++) {
    let isMin = true;
    let isMax = true;

    for (let j = i - lookbackPeriod; j <= i + lookbackPeriod; j++) {
      if (j !== i) {
        if (prices[j] < prices[i]) isMax = false;
        if (prices[j] > prices[i]) isMin = false;
      }
    }

    if (isMin) {
      // Check if this level is close to an existing support level
      const isClose = support.some(
        (level) => Math.abs(level - prices[i]) / prices[i] < threshold,
      );
      if (!isClose) {
        support.push(prices[i]);
      }
    }

    if (isMax) {
      // Check if this level is close to an existing resistance level
      const isClose = resistance.some(
        (level) => Math.abs(level - prices[i]) / prices[i] < threshold,
      );
      if (!isClose) {
        resistance.push(prices[i]);
      }
    }
  }

  // Limit the number of levels to prevent clutter
  const maxLevels = 5;
  return {
    support: support.slice(0, maxLevels),
    resistance: resistance.slice(0, maxLevels),
  };
};
