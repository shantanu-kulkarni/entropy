import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FavoritesTabProps {
  favorites: string[];
  onRemoveFavorite: (hash: string) => void;
}

export function FavoritesTab({
  favorites,
  onRemoveFavorite,
}: FavoritesTabProps) {
  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="text-lg font-mono flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Favorite Blocks ({favorites.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="space-y-2">
            {favorites.map((hash) => (
              <div
                key={hash}
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="font-mono text-sm">{hash.slice(0, 32)}...</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFavorite(hash)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-gray-600 font-mono">
              No favorite blocks yet. Start exploring!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
