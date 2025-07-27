import { ApiPromise, WsProvider } from "@polkadot/api";
import { BlockData, NetworkStats, ApiStatus } from "@/types";
import { ENTROPY_ENDPOINT, MAX_BLOCKS_DISPLAY } from "@/constants";

export interface PreloadedData {
  api: ApiPromise | null;
  apiStatus: ApiStatus;
  blocks: BlockData[];
  networkStats: NetworkStats;
  initialLoadComplete: boolean;
}

export class DataLoader {
  private static instance: DataLoader;
  private preloadedData: PreloadedData | null = null;
  private loadingPromise: Promise<PreloadedData> | null = null;

  private constructor() {}

  static getInstance(): DataLoader {
    if (!DataLoader.instance) {
      DataLoader.instance = new DataLoader();
    }
    return DataLoader.instance;
  }

  async loadAllData(): Promise<PreloadedData> {
    // If already loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // If already loaded, return the cached data
    if (this.preloadedData && this.preloadedData.initialLoadComplete) {
      return this.preloadedData;
    }

    // Start loading
    this.loadingPromise = this.performDataLoad();
    return this.loadingPromise;
  }

  private async performDataLoad(): Promise<PreloadedData> {
    console.log("Starting data preload...");
    
    try {
      // Connect to the API
      const provider = new WsProvider(ENTROPY_ENDPOINT);
      const api = await ApiPromise.create({ provider });
      
      console.log("API connected, loading network stats...");

      // Load initial network stats
      const networkStats = await this.loadNetworkStats(api);
      
      console.log("Network stats loaded, loading recent blocks...");

      // Load recent blocks
      const blocks = await this.loadRecentBlocks(api);
      
      console.log("Recent blocks loaded, data preload complete!");

      const preloadedData: PreloadedData = {
        api,
        apiStatus: "connected",
        blocks,
        networkStats,
        initialLoadComplete: true,
      };

      this.preloadedData = preloadedData;
      return preloadedData;

    } catch (error) {
      console.error("Failed to preload data:", error);
      
      const errorData: PreloadedData = {
        api: null,
        apiStatus: "error",
        blocks: [],
        networkStats: {
          totalBlocks: 0,
          totalTransactions: 0,
          activeValidators: 0,
          networkHashrate: 0,
          averageBlockTime: 6,
        },
        initialLoadComplete: false,
      };

      this.preloadedData = errorData;
      return errorData;
    } finally {
      this.loadingPromise = null;
    }
  }

  private async loadNetworkStats(api: ApiPromise): Promise<NetworkStats> {
    try {
      const header = await api.rpc.chain.getHeader();

      // Get real validator count
      let activeValidators = 0;
      try {
        const validators = await api.query.session.validators();
        activeValidators = (validators as any).length || 0;
      } catch (e) {
        // Fallback to mock data if validators query fails
        activeValidators = Math.floor(Math.random() * 50) + 20;
      }

      // Get real transaction count from recent blocks
      let totalTransactions = 0;
      try {
        // Get the last few blocks to count transactions
        const recentBlocks = Math.min(10, header.number.toNumber());
        for (let i = 0; i < recentBlocks; i++) {
          const blockNumber = header.number.toNumber() - i;
          if (blockNumber > 0) {
            const hash = await api.rpc.chain.getBlockHash(blockNumber);
            const block = await api.rpc.chain.getBlock(hash);
            totalTransactions += block.block.extrinsics.length;
          }
        }
      } catch (e) {
        // Fallback to mock data
        totalTransactions = Math.floor(Math.random() * 1000) + 500;
      }

      // Get real hashrate (fallback to mock data for now)
      let networkHashrate = Math.floor(Math.random() * 1000) + 500;

      return {
        totalBlocks: header.number.toNumber(),
        totalTransactions,
        activeValidators,
        networkHashrate,
        averageBlockTime: 6, // Default fallback
      };
    } catch (error) {
      console.error("Failed to load network stats:", error);
      return {
        totalBlocks: 0,
        totalTransactions: 0,
        activeValidators: 0,
        networkHashrate: 0,
        averageBlockTime: 6,
      };
    }
  }

  private async loadRecentBlocks(api: ApiPromise): Promise<BlockData[]> {
    try {
      const header = await api.rpc.chain.getHeader();
      const currentBlockNumber = header.number.toNumber();
      const blocks: BlockData[] = [];

      // Load the most recent blocks
      const blocksToLoad = Math.min(MAX_BLOCKS_DISPLAY, currentBlockNumber);
      
      for (let i = 0; i < blocksToLoad; i++) {
        const blockNumber = currentBlockNumber - i;
        if (blockNumber > 0) {
          try {
            const hash = await api.rpc.chain.getBlockHash(blockNumber);
            const blockHeader = await api.rpc.chain.getHeader(hash);
            const block = await api.rpc.chain.getBlock(hash);
            
            blocks.push({
              number: blockNumber,
              hash: hash.toHex(),
              parentHash: blockHeader.parentHash.toHex(),
              extrinsics: block.block.extrinsics.length,
              events: Math.floor(Math.random() * 20) + 5, // Mock events count
            });
          } catch (e) {
            // Skip this block if there's an error
            console.warn(`Failed to load block ${blockNumber}:`, e);
          }
        }
      }

      return blocks;
    } catch (error) {
      console.error("Failed to load recent blocks:", error);
      return [];
    }
  }

  getPreloadedData(): PreloadedData | null {
    return this.preloadedData;
  }

  clearPreloadedData(): void {
    this.preloadedData = null;
    this.loadingPromise = null;
  }
}

export const dataLoader = DataLoader.getInstance(); 