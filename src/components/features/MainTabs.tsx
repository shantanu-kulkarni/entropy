import { memo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExploreTab } from "./tabs/ExploreTab";
import { SearchTab } from "./tabs/SearchTab";
import { ValidatorsTab } from "./tabs/ValidatorsTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { FavoritesTab } from "./tabs/FavoritesTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { BlockData, NetworkStats, QuickAction, Theme } from "@/types";

interface MainTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  blocks: BlockData[];
  randomBlock: BlockData | null;
  surfing: boolean;
  favorites: string[];
  theme: Theme;
  networkStats: NetworkStats;
  searchQuery: string;
  api: any;
  onSurfChain: () => void;
  onToggleFavorite: (hash: string) => void;
  onRemoveFavorite: (hash: string) => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onThemeChange: (theme: Theme) => void;
}

export const MainTabs = memo(function MainTabs({
  selectedTab,
  onTabChange,
  blocks,
  randomBlock,
  surfing,
  favorites,
  theme,
  networkStats,
  searchQuery,
  api,
  onSurfChain,
  onToggleFavorite,
  onRemoveFavorite,
  onSearchQueryChange,
  onSearch,
  onThemeChange
}: MainTabsProps) {
  const handleTabChange = useCallback((value: string) => {
    onTabChange(value);
  }, [onTabChange]);

  return (
    <Tabs value={selectedTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-6 retro-card">
        <TabsTrigger value="explore" className="font-mono">Explore</TabsTrigger>
        <TabsTrigger value="search" className="font-mono">Search</TabsTrigger>
        <TabsTrigger value="validators" className="font-mono">Validators</TabsTrigger>
        <TabsTrigger value="analytics" className="font-mono">Analytics</TabsTrigger>
        <TabsTrigger value="favorites" className="font-mono">Favorites</TabsTrigger>
        <TabsTrigger value="settings" className="font-mono">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="explore" className="space-y-6">
        <ExploreTab
          blocks={blocks}
          randomBlock={randomBlock}
          surfing={surfing}
          favorites={favorites}
          theme={theme}
          onSurfChain={onSurfChain}
          onToggleFavorite={onToggleFavorite}
        />
      </TabsContent>

      <TabsContent value="search" className="space-y-6">
        <SearchTab
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onSearch={onSearch}
          api={api}
        />
      </TabsContent>

      <TabsContent value="validators" className="space-y-6">
        <ValidatorsTab networkStats={networkStats} />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <AnalyticsTab api={api} networkStats={networkStats} />
      </TabsContent>

      <TabsContent value="favorites" className="space-y-6">
        <FavoritesTab
          favorites={favorites}
          onRemoveFavorite={onRemoveFavorite}
        />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <SettingsTab
          theme={theme}
          onThemeChange={onThemeChange}
        />
      </TabsContent>
    </Tabs>
  );
}); 