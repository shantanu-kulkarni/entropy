import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchTabProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  api: any;
}

interface SearchResult {
  type: 'block' | 'address';
  data: any;
}

export const SearchTab = memo(function SearchTab({ searchQuery, onSearchQueryChange, onSearch, api }: SearchTabProps) {
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

  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('entropy-search-history', JSON.stringify(newHistory));
  }, [searchHistory]);

  const handleHistoryClick = useCallback((query: string) => {
    onSearchQueryChange(query);
  }, [onSearchQueryChange]);

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim() || !api) return;
    
    setIsSearching(true);
    setError("");
    setSearchResults([]);
    
    try {
      const results: SearchResult[] = [];
      
      if (searchType === "all" || searchType === "block") {
        // Search by block number
        if (!isNaN(Number(searchQuery))) {
          const blockNumber = parseInt(searchQuery);
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
              stateRoot: header.stateRoot.toHex()
            }
          });
        } else {
          // Search by hash
          try {
            const block = await api.rpc.chain.getBlock(searchQuery);
            const header = await api.rpc.chain.getHeader(searchQuery);
            
            results.push({
              type: 'block',
              data: {
                number: header.number.toNumber(),
                hash: searchQuery,
                extrinsics: block.block.extrinsics.length,
                parentHash: header.parentHash.toHex(),
                stateRoot: header.stateRoot.toHex()
              }
            });
          } catch (e) {
            // Not a valid hash
          }
        }
      }
      
      if (searchType === "all" || searchType === "address") {
        // Search by address
        try {
          const account = await api.query.system.account(searchQuery);
          results.push({
            type: 'address',
            data: {
              address: searchQuery,
              balance: account.data.free.toString()
            }
          });
        } catch (e) {
          // Not a valid address
        }
      }
      
      if (results.length === 0) {
        setError("No results found. Try a different search term.");
      } else {
        setSearchResults(results);
        saveToHistory(searchQuery);
      }
    } catch (error) {
      setError("Search failed. Please try again.");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, searchType, api, saveToHistory]);

  const handleSearch = useCallback(() => {
    performSearch();
  }, [performSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(e.target.value);
  }, [onSearchQueryChange]);

  const handleTypeChange = useCallback((value: string) => {
    setSearchType(value);
  }, []);

  const searchHistoryItems = useMemo(() => 
    searchHistory.map((query, index) => (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-gray-100 font-mono text-xs"
              onClick={() => handleHistoryClick(query)}
            >
              {query}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to search for "{query}"</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )), [searchHistory, handleHistoryClick]);

  return (
    <div className="space-y-6">
      <Card className="retro-card glow-blue">
        <CardHeader>
          <CardTitle className="text-lg font-mono flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter block number, hash, or address..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
            </div>
            <Select value={searchType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="font-mono"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          {searchHistory.length > 0 && (
            <div>
              <p className="text-sm font-mono text-gray-600 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistoryItems}
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 font-mono text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <Card key={index} className="retro-card">
              <CardHeader>
                <CardTitle className="text-sm font-mono">
                  {result.type === 'block' ? 'Block Details' : 'Address Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.type === 'block' ? (
                  <div className="space-y-1 font-mono text-sm">
                    <div><strong>Number:</strong> {result.data.number}</div>
                    <div><strong>Hash:</strong> {result.data.hash}</div>
                    <div><strong>Extrinsics:</strong> {result.data.extrinsics}</div>
                    <div><strong>Parent Hash:</strong> {result.data.parentHash}</div>
                    <div><strong>State Root:</strong> {result.data.stateRoot}</div>
                  </div>
                ) : (
                  <div className="space-y-1 font-mono text-sm">
                    <div><strong>Address:</strong> {result.data.address}</div>
                    <div><strong>Balance:</strong> {result.data.balance}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}); 