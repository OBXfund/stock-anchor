import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useStockData } from "@/hooks/useStockData";

interface StockChartProps {
  symbol?: string;
  timeframe?: string;
  showDEMA?: boolean;
  showSR?: boolean;
  demaShortPeriod?: number;
  demaLongPeriod?: number;
  srSensitivity?: number;
  srLookbackPeriod?: number;
}

const StockChart = ({
  symbol = "AAPL",
  timeframe = "1M",
  showDEMA = true,
  showSR = true,
  demaShortPeriod = 9,
  demaLongPeriod = 21,
  srSensitivity = 5,
  srLookbackPeriod = 50,
}: StockChartProps) => {
  const [chartType, setChartType] = useState("candle");

  // Use the stock data hook to fetch real data
  const { loading, error, quote, chartData } = useStockData({
    symbol,
    timeframe,
    demaShortPeriod,
    demaLongPeriod,
    srSensitivity,
    srLookbackPeriod,
  });

  // Chart rendering would typically use a library like recharts, d3, or a financial charting library
  // This is a placeholder for the actual chart implementation
  const renderChart = () => {
    if (loading) {
      return (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[300px] w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-[400px] bg-background border rounded-md p-4">
        {/* This would be replaced with an actual chart component */}
        <div className="absolute inset-0 p-4">
          {/* Mock chart visualization */}
          <div className="relative h-full w-full">
            {/* Price line/candles */}
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Mock price line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M0,50 C10,40 20,60 30,45 C40,30 50,70 60,55 C70,40 80,60 90,45 L100,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary"
              />

              {/* DEMA lines if enabled */}
              {showDEMA && (
                <>
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                    d="M0,55 C10,45 20,65 30,50 C40,35 50,75 60,60 C70,45 80,65 90,50 L100,55"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="1"
                    strokeDasharray="2"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                    d="M0,45 C10,35 20,55 30,40 C40,25 50,65 60,50 C70,35 80,55 90,40 L100,45"
                    fill="none"
                    stroke="#2196F3"
                    strokeWidth="1"
                    strokeDasharray="2"
                  />
                </>
              )}
            </svg>

            {/* Support and Resistance zones if enabled */}
            {showSR && (
              <>
                {/* Support zones */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-[20%] left-0 right-0 h-[5%] bg-green-500 rounded-sm"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute bottom-[10%] left-0 right-0 h-[3%] bg-green-500 rounded-sm"
                />

                {/* Resistance zones */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="absolute top-[20%] left-0 right-0 h-[5%] bg-red-500 rounded-sm"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="absolute top-[10%] left-0 right-0 h-[3%] bg-red-500 rounded-sm"
                />
              </>
            )}
          </div>

          {/* Chart overlay with price information */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm">
            <div className="text-sm font-medium">{symbol}</div>
            <div className="text-xl font-bold">$173.45</div>
            <div className="text-xs text-green-500">+2.31 (1.35%)</div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-3 bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-xs">Price</span>
            </div>
            {showDEMA && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#4CAF50] rounded-full"></div>
                  <span className="text-xs">DEMA ({demaShortPeriod})</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#2196F3] rounded-full"></div>
                  <span className="text-xs">DEMA ({demaLongPeriod})</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-background">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{symbol} Stock Chart</h3>
          <Tabs
            defaultValue={chartType}
            onValueChange={setChartType}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candle">Candle</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {renderChart()}

        <div className="mt-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Timeframe: {timeframe}</span>
            <span>
              {showDEMA
                ? `DEMA: ${demaShortPeriod}/${demaLongPeriod}`
                : "DEMA: Off"}
            </span>
            <span>
              {showSR
                ? `S&R: ${srSensitivity}/${srLookbackPeriod}`
                : "S&R: Off"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StockChart;
