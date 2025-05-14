import { useState, useEffect } from "react";
import {
  getStockQuote,
  getTimeSeriesData,
  calculateDEMA,
  identifySupportResistanceLevels,
  TimeSeriesData,
} from "@/api/stockApi";

interface StockDataHookResult {
  loading: boolean;
  error: string | null;
  quote: {
    price: number;
    change: number;
    changePercent: number;
  } | null;
  chartData: {
    dates: string[];
    prices: number[];
    volumes: number[];
    isUp: boolean[];
    dema: {
      short: number[];
      long: number[];
    };
    supportLevels: number[];
    resistanceLevels: number[];
  } | null;
}

interface StockDataHookProps {
  symbol: string;
  timeframe: string;
  demaShortPeriod: number;
  demaLongPeriod: number;
  srSensitivity: number;
  srLookbackPeriod: number;
}

export const useStockData = ({
  symbol,
  timeframe,
  demaShortPeriod,
  demaLongPeriod,
  srSensitivity,
  srLookbackPeriod,
}: StockDataHookProps): StockDataHookResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<StockDataHookResult["quote"]>(null);
  const [chartData, setChartData] =
    useState<StockDataHookResult["chartData"]>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch current quote
        const quoteData = await getStockQuote(symbol);
        setQuote({
          price: quoteData.c,
          change: quoteData.c - quoteData.pc,
          changePercent: ((quoteData.c - quoteData.pc) / quoteData.pc) * 100,
        });

        // Fetch historical data
        const timeSeriesData = await getTimeSeriesData(symbol, timeframe);

        // Extract data for chart
        const dates = timeSeriesData.map((item) => item.date);
        const prices = timeSeriesData.map((item) => item.close);
        const volumes = timeSeriesData.map((item) => item.volume);
        const isUp = timeSeriesData.map((item) => item.close >= item.open);

        // Calculate indicators
        const demaShort = calculateDEMA(prices, demaShortPeriod);
        const demaLong = calculateDEMA(prices, demaLongPeriod);

        // Identify support and resistance levels
        const { support, resistance } = identifySupportResistanceLevels(
          prices,
          srSensitivity,
          srLookbackPeriod,
        );

        setChartData({
          dates,
          prices,
          volumes,
          isUp,
          dema: {
            short: demaShort,
            long: demaLong,
          },
          supportLevels: support,
          resistanceLevels: resistance,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        setError("Failed to fetch stock data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates (every 60 seconds)
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [
    symbol,
    timeframe,
    demaShortPeriod,
    demaLongPeriod,
    srSensitivity,
    srLookbackPeriod,
  ]);

  return { loading, error, quote, chartData };
};
