export interface BlockData {
  number: number;
  hash: string;
  parentHash?: string;
  timestamp?: number;
  extrinsics?: number;
  events?: number;
}

export interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  activeValidators: number;
  networkHashrate: number;
  averageBlockTime: number;
}

export interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export type Theme = "monochrome" | "colored";

export type ApiStatus = "connecting" | "connected" | "error"; 