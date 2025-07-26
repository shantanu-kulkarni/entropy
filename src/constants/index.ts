import { 
  Globe, 
  Search, 
  Users, 
  Zap, 
  BarChart3, 
  Settings,
  Database,
  Activity,
  Cpu,
  Clock
} from "lucide-react";

export const RETRO_GRADIENTS = {
  light: "bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100",
  dark: "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900",
  retro: "bg-gradient-to-br from-green-100 via-amber-50 to-orange-100",
  monochrome: "bg-gradient-to-br from-gray-50 via-white to-gray-100"
} as const;

export const NETWORK_STATS_ICONS = {
  totalBlocks: Database,
  totalTransactions: Activity,
  activeValidators: Users,
  networkHashrate: Cpu,
  averageBlockTime: Clock
} as const;

export const NETWORK_STATS_LABELS = {
  totalBlocks: "Total Blocks",
  totalTransactions: "Transactions", 
  activeValidators: "Validators",
  networkHashrate: "Hashrate",
  averageBlockTime: "Block Time"
} as const;

export const NETWORK_STATS_COLORS = {
  totalBlocks: "text-green-600",
  totalTransactions: "text-blue-600",
  activeValidators: "text-purple-600", 
  networkHashrate: "text-orange-600",
  averageBlockTime: "text-red-600"
} as const;

export const NETWORK_STATS_GLOWS = {
  totalBlocks: "glow-green",
  totalTransactions: "glow-blue",
  activeValidators: "glow-purple",
  networkHashrate: "",
  averageBlockTime: ""
} as const;

export const ENTROPY_ENDPOINT = "wss://testnet.entropy.xyz";

export const DEFAULT_REFRESH_INTERVAL = 5000;
export const MAX_BLOCKS_DISPLAY = 20; 