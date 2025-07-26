import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Theme } from "@/types";

interface SettingsTabProps {
  theme: Theme;
  autoRefresh: boolean;
  refreshInterval: number;
  onThemeChange: (theme: Theme) => void;
  onAutoRefreshChange: (enabled: boolean) => void;
  onRefreshIntervalChange: (interval: number) => void;
}

export function SettingsTab({ 
  theme, 
  autoRefresh, 
  refreshInterval, 
  onThemeChange, 
  onAutoRefreshChange, 
  onRefreshIntervalChange 
}: SettingsTabProps) {
  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="text-lg font-mono flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Explorer Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-mono">Theme</Label>
              <p className="text-sm text-gray-500">Choose your preferred theme</p>
            </div>
            <Select value={theme} onValueChange={(value: Theme) => onThemeChange(value)}>
              <SelectTrigger className="w-32 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="retro">Retro</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-mono">Auto-refresh</Label>
              <p className="text-sm text-gray-500">Automatically update data</p>
            </div>
            <Switch
              checked={autoRefresh}
              onCheckedChange={onAutoRefreshChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-mono">Refresh Interval</Label>
              <p className="text-sm text-gray-500">How often to refresh data</p>
            </div>
            <div className="w-32">
              <Slider
                value={[refreshInterval / 1000]}
                onValueChange={([value]) => onRefreshIntervalChange(value * 1000)}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500 text-center font-mono">
                {refreshInterval / 1000}s
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 