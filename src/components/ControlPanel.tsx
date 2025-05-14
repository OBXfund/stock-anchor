import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ControlPanelProps {
  onTimeframeChange?: (timeframe: string) => void;
  onDemaToggle?: (enabled: boolean) => void;
  onSRToggle?: (enabled: boolean) => void;
  onSettingsChange?: (settings: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onTimeframeChange = () => {},
  onDemaToggle = () => {},
  onSRToggle = () => {},
  onSettingsChange = () => {},
}) => {
  const [demaEnabled, setDemaEnabled] = useState(true);
  const [srEnabled, setSrEnabled] = useState(true);
  const [timeframe, setTimeframe] = useState("1M");
  const [showSettings, setShowSettings] = useState(false);

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    onTimeframeChange(value);
  };

  const handleDemaToggle = (checked: boolean) => {
    setDemaEnabled(checked);
    onDemaToggle(checked);
  };

  const handleSRToggle = (checked: boolean) => {
    setSrEnabled(checked);
    onSRToggle(checked);
  };

  return (
    <div className="w-full p-4 bg-background border-b flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Tabs
          defaultValue={timeframe}
          onValueChange={handleTimeframeChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-7 w-full sm:w-auto">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="6M">6M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
            <TabsTrigger value="5Y">5Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
        <div className="flex items-center space-x-2">
          <Switch
            id="dema-toggle"
            checked={demaEnabled}
            onCheckedChange={handleDemaToggle}
          />
          <Label htmlFor="dema-toggle">DEMA</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="sr-toggle"
            checked={srEnabled}
            onCheckedChange={handleSRToggle}
          />
          <Label htmlFor="sr-toggle">S&R Levels</Label>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Open settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="p-4">
              <h4 className="font-medium mb-3">Indicator Settings</h4>

              {demaEnabled && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">DEMA Parameters</h5>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="dema-short-period" className="text-xs">
                        Short Period
                      </Label>
                      <input
                        type="range"
                        id="dema-short-period"
                        min="5"
                        max="50"
                        defaultValue="12"
                        className="w-full"
                        onChange={(e) =>
                          onSettingsChange({
                            type: "dema",
                            shortPeriod: parseInt(e.target.value),
                          })
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5</span>
                        <span>50</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dema-long-period" className="text-xs">
                        Long Period
                      </Label>
                      <input
                        type="range"
                        id="dema-long-period"
                        min="10"
                        max="200"
                        defaultValue="26"
                        className="w-full"
                        onChange={(e) =>
                          onSettingsChange({
                            type: "dema",
                            longPeriod: parseInt(e.target.value),
                          })
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {srEnabled && (
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Support & Resistance Parameters
                  </h5>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="sr-sensitivity" className="text-xs">
                        Sensitivity
                      </Label>
                      <input
                        type="range"
                        id="sr-sensitivity"
                        min="1"
                        max="10"
                        defaultValue="5"
                        className="w-full"
                        onChange={(e) =>
                          onSettingsChange({
                            type: "sr",
                            sensitivity: parseInt(e.target.value),
                          })
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sr-lookback" className="text-xs">
                        Lookback Period
                      </Label>
                      <input
                        type="range"
                        id="sr-lookback"
                        min="20"
                        max="200"
                        defaultValue="100"
                        className="w-full"
                        onChange={(e) =>
                          onSettingsChange({
                            type: "sr",
                            lookback: parseInt(e.target.value),
                          })
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>20</span>
                        <span>200</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className="w-full mt-4"
                onClick={() => setShowSettings(false)}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ControlPanel;
