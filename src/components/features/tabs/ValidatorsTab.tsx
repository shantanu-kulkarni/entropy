import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NetworkStats } from "@/types";

interface ValidatorsTabProps {
  networkStats: NetworkStats;
}

export function ValidatorsTab({ networkStats }: ValidatorsTabProps) {
  return (
    <Card className="retro-card glow-purple">
      <CardHeader>
        <CardTitle className="text-lg font-mono flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Network Validators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-600 font-mono">
            {networkStats.activeValidators} active validators securing the
            network
          </p>
          <Progress value={75} className="mt-4" />
          <p className="text-sm text-gray-500 font-mono mt-2">
            Network consensus: 75% active
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
