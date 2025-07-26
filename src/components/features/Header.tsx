import { Network, Palette, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Theme, ApiStatus } from "@/types";

interface HeaderProps {
  apiStatus: ApiStatus;
  theme: Theme;
  autoRefresh: boolean;
  onThemeChange: (theme: Theme) => void;
  onAutoRefreshChange: (enabled: boolean) => void;
}

export function Header({ 
  apiStatus, 
  theme, 
  autoRefresh, 
  onThemeChange, 
  onAutoRefreshChange 
}: HeaderProps) {
  const getThemeIcon = () => {
    switch (theme) {
      case "monochrome":
        return <Palette className="h-4 w-4 mr-2" />;
      case "retro":
        return <Palette className="h-4 w-4 mr-2" />;
      case "light":
        return <Sun className="h-4 w-4 mr-2" />;
      case "dark":
        return <Moon className="h-4 w-4 mr-2" />;
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ["monochrome", "retro", "light", "dark"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    onThemeChange(themes[nextIndex]);
  };

  return (
    <header className={`border-b retro-card ${theme === "monochrome" ? "border-gray-300" : "border-green-300"}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Network className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Entropy Explorer
              </h1>
            </div>
            <Badge variant={apiStatus === "connected" ? "default" : "destructive"} className="font-mono">
              {apiStatus === "connecting" && "Connecting..."}
              {apiStatus === "connected" && "Connected"}
              {apiStatus === "error" && "Disconnected"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={cycleTheme}
              className="font-mono"
            >
              {getThemeIcon()}
              {theme}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoRefresh}
                onCheckedChange={onAutoRefreshChange}
              />
              <Label className="text-sm font-mono">Auto-refresh</Label>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 