import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchTabProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
}

export function SearchTab({ searchQuery, onSearchQueryChange, onSearch }: SearchTabProps) {
  return (
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
                className="font-mono"
              />
            </div>
            <div className="w-32">
              <Label className="font-mono">Type</Label>
              <Select>
                <SelectTrigger className="font-mono">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="blocks">Blocks</SelectItem>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="addresses">Addresses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full font-mono" onClick={onSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search Entropy Network
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 