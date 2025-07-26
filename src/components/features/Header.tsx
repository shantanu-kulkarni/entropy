import { memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Palette, Sun } from "lucide-react";
import { Theme, ApiStatus } from "@/types";

interface HeaderProps {
  apiStatus: ApiStatus;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Header = memo(function Header({
  apiStatus,
  theme,
  onThemeChange,
}: HeaderProps) {
  const handleThemeToggle = useCallback(
    (checked: boolean) => {
      const newTheme: Theme = checked ? "colored" : "monochrome";
      onThemeChange(newTheme);
    },
    [onThemeChange]
  );

  const isColored = theme === "colored";

  return (
    <header
      className={`border-b retro-card ${
        theme === "monochrome" ? "border-gray-300" : "border-green-300"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-black">
                Entropy
              </h1>
            </div>
            <Badge
              variant={apiStatus === "connected" ? "default" : "destructive"}
              className="font-mono"
            >
              {apiStatus === "connecting" && "Connecting..."}
              {apiStatus === "connected" && "Connected"}
              {apiStatus === "error" && "Disconnected"}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-gray-600" />
              <Switch checked={isColored} onCheckedChange={handleThemeToggle} />
              <Sun className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
