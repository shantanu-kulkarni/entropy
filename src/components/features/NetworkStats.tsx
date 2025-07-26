import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkStats as NetworkStatsType } from "@/types";
import { 
  NETWORK_STATS_ICONS, 
  NETWORK_STATS_LABELS, 
  NETWORK_STATS_COLORS, 
  NETWORK_STATS_GLOWS 
} from "@/constants";

interface NetworkStatsProps {
  stats: NetworkStatsType;
  theme: string;
}

export function NetworkStats({ stats, theme }: NetworkStatsProps) {
  const statItems = [
    { key: 'totalBlocks', value: stats.totalBlocks, suffix: '' },
    { key: 'totalTransactions', value: stats.totalTransactions, suffix: '' },
    { key: 'activeValidators', value: stats.activeValidators, suffix: '' },
    { key: 'networkHashrate', value: stats.networkHashrate, suffix: ' H/s' },
    { key: 'averageBlockTime', value: stats.averageBlockTime, suffix: 's' }
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map(({ key, value, suffix }) => {
        const Icon = NETWORK_STATS_ICONS[key];
        const label = NETWORK_STATS_LABELS[key];
        const colorClass = NETWORK_STATS_COLORS[key];
        const glowClass = NETWORK_STATS_GLOWS[key];
        
        return (
          <Card key={key} className={`retro-card ${glowClass} retro-hover`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono flex items-center">
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colorClass}`}>
                {value.toLocaleString()}{suffix}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 