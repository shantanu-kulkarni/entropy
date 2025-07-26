import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsTab() {
  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="text-lg font-mono flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Network Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-mono font-bold">Block Production</h3>
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-mono">Chart Placeholder</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-mono font-bold">Transaction Volume</h3>
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-mono">Chart Placeholder</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 