import { useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { 
  Globe, 
  Search, 
  Users, 
  Zap, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { Header } from "@/components/features/Header";
import { NetworkStats } from "@/components/features/NetworkStats";
import { QuickActions } from "@/components/features/QuickActions";
import { MainTabs } from "@/components/features/MainTabs";
import { Footer } from "@/components/features/Footer";
import { BlockData, NetworkStats as NetworkStatsType, QuickAction, Theme, ApiStatus } from "@/types";
import { RETRO_GRADIENTS, ENTROPY_ENDPOINT, DEFAULT_REFRESH_INTERVAL, MAX_BLOCKS_DISPLAY } from "@/constants";

interface HomeProps {
  onThemeChange: (theme: Theme) => void;
}

export function Home({ onThemeChange }: HomeProps) {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("connecting");
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [randomBlock, setRandomBlock] = useState<BlockData | null>(null);
  const [surfing, setSurfing] = useState(false);
  const [networkStats, setNetworkStats] = useState<NetworkStatsType>({
    totalBlocks: 0,
    totalTransactions: 0,
    activeValidators: 0,
    networkHashrate: 0,
    averageBlockTime: 0
  });
  const [selectedTab, setSelectedTab] = useState("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>("monochrome");
  const [showColorful, setShowColorful] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(DEFAULT_REFRESH_INTERVAL);

  // Connect to Entropy testnet
  useEffect(() => {
    const provider = new WsProvider(ENTROPY_ENDPOINT);
    ApiPromise.create({ provider })
      .then((api) => {
        setApi(api);
        setApiStatus("connected");
      })
      .catch(() => {
        setApiStatus("error");
      });
    
    return () => {
      provider.disconnect();
    };
  }, []);

  // Subscribe to new blocks
  useEffect(() => {
    if (!api) return;
    let unsub: (() => void) | undefined;
    
    api.rpc.chain.subscribeNewHeads(async (header) => {
      const newBlock: BlockData = { 
        number: header.number.toNumber(), 
        hash: header.hash.toHex() 
      };
      setBlocks((prev) => {
        const updated = [newBlock, ...prev].slice(0, MAX_BLOCKS_DISPLAY);
        return updated;
      });
      
      updateNetworkStats();
    }).then((u) => { unsub = u; });
    
    return () => { if (unsub) unsub(); };
  }, [api]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !api) return;
    
    const interval = setInterval(() => {
      updateNetworkStats();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, api]);

  const updateNetworkStats = async () => {
    if (!api) return;
    
    try {
      const header = await api.rpc.chain.getHeader();
      
      setNetworkStats({
        totalBlocks: header.number.toNumber(),
        totalTransactions: blocks.reduce((sum, block) => sum + (block.extrinsics || 0), 0),
        activeValidators: Math.floor(Math.random() * 50) + 20, // Mock data for now
        networkHashrate: Math.floor(Math.random() * 1000) + 500, // Mock data
        averageBlockTime: 6 // Mock data
      });
    } catch (error) {
      console.error("Failed to update network stats:", error);
    }
  };

  const surfTheChain = async () => {
    if (!api) return;
    setSurfing(true);
    try {
      const lastHeader = await api.rpc.chain.getHeader();
      const latest = lastHeader.number.toNumber();
      const randomNumber = Math.floor(Math.random() * latest) + 1;
      const hash = await api.rpc.chain.getBlockHash(randomNumber);
      const header = await api.rpc.chain.getHeader(hash);
      
      setRandomBlock({
        number: randomNumber,
        hash: hash.toHex(),
        parentHash: header.parentHash.toHex(),
        timestamp: Date.now(),
        extrinsics: Math.floor(Math.random() * 10) + 1,
        events: Math.floor(Math.random() * 20) + 5
      });
    } catch (e) {
      setRandomBlock(null);
    }
    setSurfing(false);
  };

  const toggleFavorite = (hash: string) => {
    setFavorites(prev => 
      prev.includes(hash) 
        ? prev.filter(h => h !== hash)
        : [...prev, hash]
    );
  };

  const removeFavorite = (hash: string) => {
    setFavorites(prev => prev.filter(h => h !== hash));
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  // Transition to colorful theme after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowColorful(true);
    }, 500); // Reduced delay for faster color transition

    return () => clearTimeout(timer);
  }, []);

  const quickActions: QuickAction[] = [
    { icon: <Globe className="h-4 w-4" />, label: "Explore Network", action: () => setSelectedTab("explore") },
    { icon: <Search className="h-4 w-4" />, label: "Search Blocks", action: () => setSelectedTab("search") },
    { icon: <Users className="h-4 w-4" />, label: "View Validators", action: () => setSelectedTab("validators") },
    { icon: <Zap className="h-4 w-4" />, label: "Chain Surf", action: surfTheChain },
    { icon: <BarChart3 className="h-4 w-4" />, label: "Analytics", action: () => setSelectedTab("analytics") },
    { icon: <Settings className="h-4 w-4" />, label: "Settings", action: () => setSelectedTab("settings") }
  ];

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const currentTheme = showColorful ? theme : "monochrome";
  
  return (
    <div className={`min-h-screen ${RETRO_GRADIENTS[currentTheme]} retro-bg transition-all duration-1000 ${currentTheme === "monochrome" ? "monochrome" : ""}`}>
              <Header
          apiStatus={apiStatus}
          theme={currentTheme}
          autoRefresh={autoRefresh}
          onThemeChange={handleThemeChange}
          onAutoRefreshChange={setAutoRefresh}
        />

      <main className="container mx-auto px-4 py-6">
        <NetworkStats stats={networkStats} theme={currentTheme} />
        
        <QuickActions actions={quickActions} theme={currentTheme} />

                  <MainTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            blocks={blocks}
            randomBlock={randomBlock}
            surfing={surfing}
            favorites={favorites}
            theme={currentTheme}
            networkStats={networkStats}
            searchQuery={searchQuery}
            autoRefresh={autoRefresh}
            refreshInterval={refreshInterval}
            onSurfChain={surfTheChain}
            onToggleFavorite={toggleFavorite}
            onRemoveFavorite={removeFavorite}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            onThemeChange={handleThemeChange}
            onAutoRefreshChange={setAutoRefresh}
            onRefreshIntervalChange={setRefreshInterval}
          />
      </main>

      <Footer theme={currentTheme} />
    </div>
  );
} 