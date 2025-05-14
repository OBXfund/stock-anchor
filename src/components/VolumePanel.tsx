import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockData } from "@/hooks/useStockData";

interface VolumePanelProps {
  symbol?: string;
  timeframe?: string;
  data?: {
    date: string;
    volume: number;
    isUp: boolean;
  }[];
  isLoading?: boolean;
  height?: number;
  significantLevels?: number[];
}

const VolumePanel = ({
  symbol = "AAPL",
  timeframe = "1M",
  data,
  isLoading,
  height = 150,
  significantLevels = [10000000, 15000000, 20000000],
}: VolumePanelProps) => {
  // Use the stock data hook if no data is provided
  const { loading: hookLoading, chartData } = useStockData({
    symbol,
    timeframe,
    demaShortPeriod: 9,
    demaLongPeriod: 21,
    srSensitivity: 5,
    srLookbackPeriod: 50,
  });

  // Use provided data or data from the hook
  const volumeData = useMemo(() => {
    if (data) return data;
    if (!chartData) return generateMockVolumeData();

    return chartData.dates.map((date, index) => ({
      date,
      volume: chartData.volumes[index],
      isUp: chartData.isUp[index],
    }));
  }, [data, chartData]);

  // Use provided loading state or loading state from the hook
  const loading = isLoading !== undefined ? isLoading : hookLoading;
  if (isLoading) {
    return (
      <Card className="w-full p-4 bg-background">
        <Skeleton className="w-full h-[150px]" />
      </Card>
    );
  }

  const maxVolume = Math.max(...data.map((item) => item.volume));

  return (
    <Card className="w-full p-4 bg-background">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Volume</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-xs">Up</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-xs">Down</span>
            </div>
          </div>
        </div>

        <div className="relative" style={{ height: `${height}px` }}>
          {/* Significant volume levels */}
          {significantLevels.map((level, index) => (
            <div
              key={`level-${index}`}
              className="absolute w-full border-t border-dashed border-muted-foreground/30 flex justify-end"
              style={{
                bottom: `${(level / maxVolume) * height}px`,
                zIndex: 10,
              }}
            >
              <span className="text-xs text-muted-foreground pr-1">
                {formatVolume(level)}
              </span>
            </div>
          ))}

          {/* Volume bars */}
          <div className="absolute inset-0 flex items-end">
            <div className="flex items-end w-full h-full">
              {safeData &&
                safeData.map((item, index) => {
                  const barHeight = (item.volume / maxVolume) * height;
                  return (
                    <div
                      key={`volume-${index}`}
                      className="flex-1 mx-[1px]"
                      style={{ height: `${barHeight}px` }}
                    >
                      <div
                        className={`w-full h-full ${item.isUp ? "bg-green-500/70" : "bg-red-500/70"}`}
                        title={`Date: ${item.date}\nVolume: ${formatVolume(item.volume)}`}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Helper function to format volume numbers
const formatVolume = (volume: number): string => {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`;
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

// Generate mock data for default state
const generateMockVolumeData = () => {
  const data = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const volume = Math.floor(Math.random() * 25000000) + 1000000;
    const isUp = Math.random() > 0.4;

    data.push({
      date: date.toISOString().split("T")[0],
      volume,
      isUp,
    });
  }

  return data;
};

export default VolumePanel;
