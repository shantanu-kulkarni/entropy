import { Search, Clock, Hash, User, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface SearchTabProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  api: any; // Polkadot API instance
}

interface SearchResult {
  type: 'block' | 'transaction' | 'address';
  data: any;
  timestamp: number;
}

export function SearchTab({ searchQuery, onSearchQueryChange, onSearch, api }: SearchTabProps) {
  const [searchType, setSearchType] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('entropy-search-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('entropy-search-history', JSON.stringify(newHistory));
  };

  const performSearch = async () => {
    if (!searchQuery.trim() || !api) return;

    setIsSearching(true);
    setError("");
    
    try {
      const query = searchQuery.trim();
      saveToHistory(query);
      
      let results: SearchResult[] = [];

      // Search by block number
      if (/^\d+$/.test(query)) {
        const blockNumber = parseInt(query);
        try {
          const hash = await api.rpc.chain.getBlockHash(blockNumber);
          const block = await api.rpc.chain.getBlock(hash);
          const header = await api.rpc.chain.getHeader(hash);
          
          results.push({
            type: 'block',
            data: {
              number: blockNumber,
              hash: hash.toHex(),
              extrinsics: block.block.extrinsics.length,
              parentHash: header.parentHash.toHex(),
              stateRoot: header.stateRoot.toHex(),
              timestamp: Date.now()
            },
            timestamp: Date.now()
          });
        } catch (e) {
          setError(`Block ${blockNumber} not found`);
        }
      }
      // Search by hash
      else if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
        try {
          const block = await api.rpc.chain.getBlock(query);
          const header = await api.rpc.chain.getHeader(query);
          
          results.push({
            type: 'block',
            data: {
              number: header.number.toNumber(),
              hash: query,
              extrinsics: block.block.extrinsics.length,
              parentHash: header.parentHash.toHex(),
              stateRoot: header.stateRoot.toHex(),
              timestamp: Date.now()
            },
            timestamp: Date.now()
          });
        } catch (e) {
          setError(`Hash ${query} not found`);
        }
      }
      // Search by address (basic validation)
      else if (/^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(query)) {
        try {
          // For addresses, we'll show basic info and try to get balance
          let balance = '0';
          try {
            const accountInfo = await api.query.system.account(query);
            balance = accountInfo.data.free.toString();
          } catch (e) {
            // Balance query might fail, use default
          }
          
          results.push({
            type: 'address',
            data: {
              address: query,
              balance: balance,
              transactions: 0 // Would need to scan blocks to count transactions
            },
            timestamp: Date.now()
          });
        } catch (e) {
          setError(`Address ${query} not found`);
        }
      }
      else {
        setError("Invalid search format. Use block number, hash, or address.");
      }

      setSearchResults(results);
    } catch (e) {
      setError("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    performSearch();
    onSearch();
  };

  const handleHistoryClick = (query: string) => {
    onSearchQueryChange(query);
  };

  return (
    <div className="space-y-6">
      <Card className="retro-card glow-green">
        <CardHeader>
          <CardTitle className="text-lg font-mono flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search the Chain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="search" className="font-mono">Search Query</Label>
                <Input
                  id="search"
                  placeholder="Enter block number, hash, or address..."
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="font-mono"
                />
              </div>

            </div>
            <Button 
              className="w-full font-mono" 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isSearching ? "Searching..." : "Search Entropy Network"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Search History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 font-mono"
                  onClick={() => handleHistoryClick(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="retro-card border-red-300">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="font-mono">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center">
              <Hash className="h-5 w-5 mr-2" />
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {result.type === 'block' && <Hash className="h-4 w-4" />}
                      {result.type === 'address' && <User className="h-4 w-4" />}
                      <Badge variant="secondary" className="font-mono">
                        {result.type.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500 font-mono">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {result.type === 'block' && (
                    <div className="space-y-1">
                      <div className="font-mono">
                        <span className="font-bold">Block #{result.data.number}</span>
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Hash: {result.data.hash.slice(0, 16)}...
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Extrinsics: {result.data.extrinsics}
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Parent: {result.data.parentHash.slice(0, 16)}...
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        State Root: {result.data.stateRoot.slice(0, 16)}...
                      </div>
                    </div>
                  )}
                  
                  {result.type === 'address' && (
                    <div className="space-y-1">
                      <div className="font-mono">
                        <span className="font-bold">Address</span>
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        {result.data.address.slice(0, 16)}...
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        Balance: {parseInt(result.data.balance) / 1e12} ENTR
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 