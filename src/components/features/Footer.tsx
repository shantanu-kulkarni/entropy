import { Badge } from "@/components/ui/badge";
import { Theme } from "@/types";
import { ENTROPY_ENDPOINT } from "@/constants";

interface FooterProps {
  theme: Theme;
}

export function Footer({ theme }: FooterProps) {
  return (
    <footer className={`border-t retro-card mt-12 ${theme === "monochrome" ? "border-gray-300" : "border-green-300"}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-mono text-gray-600">
              Entropy Explorer v1.0.0
            </span>
            <Badge variant="outline" className="font-mono">
              Testnet
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-mono text-gray-600">
              Connected to: {ENTROPY_ENDPOINT}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 