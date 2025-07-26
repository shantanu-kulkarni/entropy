import { Settings, Palette, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Theme } from "@/types";

interface SettingsTabProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function SettingsTab({ 
  theme, 
  onThemeChange 
}: SettingsTabProps) {
  const handleThemeToggle = (checked: boolean) => {
    const newTheme: Theme = checked ? "colored" : "monochrome";
    onThemeChange(newTheme);
  };

  const isColored = theme === "colored";

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
              <p className="text-sm text-gray-500">Toggle between monochrome and colored themes</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-600" />
                <Label className="font-mono">Monochrome</Label>
              </div>
              <Switch
                checked={isColored}
                onCheckedChange={handleThemeToggle}
              />
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-600" />
                <Label className="font-mono">Colored</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div>
              <Label className="font-mono">About</Label>
              <p className="text-sm text-gray-500 mt-2">
                Entropy Explorer is a desktop application for exploring the Entropy testnet blockchain. 
                Connect to the network to view real-time block data, search for specific blocks or addresses, 
                and analyze network statistics.
              </p>
            </div>
            
            <div>
              <Label className="font-mono">Network</Label>
              <p className="text-sm text-gray-500 mt-2">
                Connected to: wss://testnet.entropy.xyz
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 