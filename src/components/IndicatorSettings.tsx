import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Settings } from "lucide-react";

interface IndicatorSettingsProps {
  onApply?: (settings: IndicatorSettingsValues) => void;
  defaultSettings?: IndicatorSettingsValues;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface IndicatorSettingsValues {
  demaShortPeriod: number;
  demaLongPeriod: number;
  srSensitivity: number;
  srLookbackPeriod: number;
}

const IndicatorSettings = ({
  onApply,
  defaultSettings = {
    demaShortPeriod: 9,
    demaLongPeriod: 21,
    srSensitivity: 50,
    srLookbackPeriod: 20,
  },
  open = false,
  onOpenChange,
}: IndicatorSettingsProps) => {
  const [settings, setSettings] =
    useState<IndicatorSettingsValues>(defaultSettings);

  const handleApply = () => {
    if (onApply) {
      onApply(settings);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IndicatorSettingsValues,
  ) => {
    const value = parseInt(e.target.value, 10) || 0;
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (
    value: number[],
    field: keyof IndicatorSettingsValues,
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value[0] }));
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span>Indicator Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-background" side="bottom">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Indicator Settings</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">DEMA Settings</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="demaShortPeriod">Short Period</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.demaShortPeriod}
                    </span>
                  </div>
                  <Slider
                    id="demaShortPeriod"
                    min={2}
                    max={50}
                    step={1}
                    value={[settings.demaShortPeriod]}
                    onValueChange={(value) =>
                      handleSliderChange(value, "demaShortPeriod")
                    }
                  />
                  <Input
                    id="demaShortPeriodInput"
                    type="number"
                    value={settings.demaShortPeriod}
                    onChange={(e) => handleInputChange(e, "demaShortPeriod")}
                    className="h-8 w-20 mt-1"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="demaLongPeriod">Long Period</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.demaLongPeriod}
                    </span>
                  </div>
                  <Slider
                    id="demaLongPeriod"
                    min={5}
                    max={200}
                    step={1}
                    value={[settings.demaLongPeriod]}
                    onValueChange={(value) =>
                      handleSliderChange(value, "demaLongPeriod")
                    }
                  />
                  <Input
                    id="demaLongPeriodInput"
                    type="number"
                    value={settings.demaLongPeriod}
                    onChange={(e) => handleInputChange(e, "demaLongPeriod")}
                    className="h-8 w-20 mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">
                Support & Resistance Settings
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="srSensitivity">Sensitivity</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.srSensitivity}%
                    </span>
                  </div>
                  <Slider
                    id="srSensitivity"
                    min={10}
                    max={100}
                    step={1}
                    value={[settings.srSensitivity]}
                    onValueChange={(value) =>
                      handleSliderChange(value, "srSensitivity")
                    }
                  />
                  <Input
                    id="srSensitivityInput"
                    type="number"
                    value={settings.srSensitivity}
                    onChange={(e) => handleInputChange(e, "srSensitivity")}
                    className="h-8 w-20 mt-1"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="srLookbackPeriod">Lookback Period</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.srLookbackPeriod} days
                    </span>
                  </div>
                  <Slider
                    id="srLookbackPeriod"
                    min={5}
                    max={100}
                    step={1}
                    value={[settings.srLookbackPeriod]}
                    onValueChange={(value) =>
                      handleSliderChange(value, "srLookbackPeriod")
                    }
                  />
                  <Input
                    id="srLookbackPeriodInput"
                    type="number"
                    value={settings.srLookbackPeriod}
                    onChange={(e) => handleInputChange(e, "srLookbackPeriod")}
                    className="h-8 w-20 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IndicatorSettings;
