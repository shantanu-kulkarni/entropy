import { memo, useCallback } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickAction, Theme } from "@/types";

interface QuickActionsProps {
  actions: QuickAction[];
  theme: Theme;
}

export const QuickActions = memo(function QuickActions({ actions, theme }: QuickActionsProps) {
  const handleActionClick = useCallback((action: QuickAction) => {
    action.action();
  }, []);

  return (
    <Card className="retro-card glow-green mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-mono flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 font-mono text-xs retro-button retro-hover ${
                theme === "monochrome" ? "border-gray-300 hover:bg-gray-50" : "border-green-300 hover:bg-green-50"
              }`}
              onClick={() => handleActionClick(action)}
            >
              {action.icon}
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}); 