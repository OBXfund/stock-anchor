import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ControlPanel from "./ControlPanel";
import StockChart from "./StockChart";
import VolumePanel from "./VolumePanel";

interface HomeProps {
  defaultSymbol?: string;
}

const Home = ({ defaultSymbol = "AAPL" }: HomeProps) => {
  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [timeframe, setTimeframe] = useState("1M"); // Default timeframe: 1 month
  const [showDEMA, setShowDEMA] = useState(true);
  const [showSR, setShowSR] = useState(true);
  const [demaSettings, setDemaSettings] = useState({
    shortPeriod: 9,
    longPeriod: 21,
  });
  const [srSettings, setSrSettings] = useState({
    sensitivity: 3,
    lookbackPeriod: 50,
  });

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  const handleToggleDEMA = () => {
    setShowDEMA(!showDEMA);
  };

  const handleToggleSR = () => {
    setShowSR(!showSR);
  };

  const handleDemaSettingsChange = (settings: typeof demaSettings) => {
    setDemaSettings(settings);
  };

  const handleSrSettingsChange = (settings: typeof srSettings) => {
    setSrSettings(settings);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Stock Analysis Dashboard
        </h1>
        <p className="text-muted-foreground">
          DEMA & Volume-Based Analysis for {selectedSymbol}
        </p>
      </header>

      <Card className="mb-6">
        <CardContent className="p-4">
          <ControlPanel
            timeframe={timeframe}
            onTimeframeChange={handleTimeframeChange}
            showDEMA={showDEMA}
            onToggleDEMA={handleToggleDEMA}
            showSR={showSR}
            onToggleSR={handleToggleSR}
            demaSettings={demaSettings}
            onDemaSettingsChange={handleDemaSettingsChange}
            srSettings={srSettings}
            onSrSettingsChange={handleSrSettingsChange}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="chart" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Price Chart</h2>
              </div>
              <div className="h-[500px] w-full">
                <StockChart
                  symbol={selectedSymbol}
                  timeframe={timeframe}
                  showDEMA={showDEMA}
                  showSR={showSR}
                  demaSettings={demaSettings}
                  srSettings={srSettings}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Volume Analysis</h2>
              </div>
              <div className="h-[150px] w-full">
                <VolumePanel symbol={selectedSymbol} timeframe={timeframe} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">DEMA Analysis</h3>
                  <p className="text-muted-foreground">
                    The Double Exponential Moving Average (DEMA) shows a{" "}
                    {showDEMA ? "bullish" : "neutral"} trend with the short
                    period ({demaSettings.shortPeriod}){" "}
                    {showDEMA ? "above" : "crossing"} the long period (
                    {demaSettings.longPeriod}).
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Support & Resistance</h3>
                  <p className="text-muted-foreground">
                    Key support levels identified at $150.25 and $145.80.
                    Resistance zones detected at $165.30 and $172.45.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Volume Profile</h3>
                  <p className="text-muted-foreground">
                    Significant volume concentration at the $155-$160 price
                    range, indicating a strong support zone with high trading
                    interest.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
