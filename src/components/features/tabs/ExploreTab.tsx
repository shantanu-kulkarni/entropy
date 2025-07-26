import { Database, Globe, RefreshCw, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockData, Theme } from "@/types";

interface ExploreTabProps {
  blocks: BlockData[];
  randomBlock: BlockData | null;
  surfing: boolean;
  favorites: string[];
  theme: Theme;
  onSurfChain: () => void;
  onToggleFavorite: (hash: string) => void;
}

export function ExploreTab({ 
  blocks, 
  randomBlock, 
  surfing, 
  favorites, 
  onSurfChain, 
  onToggleFavorite 
}: ExploreTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Latest Blocks */}
      <Card className="retro-card glow-green">
        <CardHeader>
          <CardTitle className="text-lg font-mono flex items-center justify-between">
            <span>Latest Blocks</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onSurfChain}
              disabled={surfing}
              className="font-mono"
            >
              {surfing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {surfing ? "Surfing..." : "Surf Chain"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {blocks.map((block) => (
                <div
                  key={block.hash}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Database className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-mono font-bold text-green-700">
                        #{block.number}
                      </div>
                      <div className="font-mono text-xs text-gray-500 truncate w-32">
                        {block.hash.slice(0, 16)}...
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(block.hash)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    {favorites.includes(block.hash) ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Random Block Discovery */}
      <Card className="retro-card glow-blue">
        <CardHeader>
          <CardTitle className="text-lg font-mono flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Chain Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          {randomBlock ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono font-bold text-blue-700">
                    Block #{randomBlock.number}
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    {randomBlock.extrinsics} tx
                  </Badge>
                </div>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hash:</span>
                    <span className="text-blue-600 truncate w-48">
                      {randomBlock.hash.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parent:</span>
                    <span className="text-blue-600 truncate w-48">
                      {randomBlock.parentHash?.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events:</span>
                    <span className="text-blue-600">{randomBlock.events}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={onSurfChain}
                disabled={surfing}
                className="w-full font-mono"
              >
                {surfing ? "Surfing..." : "🌊 Surf Again!"}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 font-mono mb-4">
                Ready to discover the chain?
              </p>
              <Button
                onClick={onSurfChain}
                disabled={surfing}
                className="font-mono"
              >
                {surfing ? "Surfing..." : "Start Surfing!"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 