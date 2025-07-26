import { useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import "./App.css";
import { Button } from "@/components/ui/button";
import { SplashScreen } from "@/components/ui/splash-screen";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ParticleField } from "@/components/ui/ParticleField";

function App() {
  const [apiStatus, setApiStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [blocks, setBlocks] = useState<Array<{ number: number; hash: string }>>([]);
  const [randomBlock, setRandomBlock] = useState<null | { number: number; hash: string; parentHash: string }>(null);
  const [surfing, setSurfing] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const provider = new WsProvider("wss://testnet.entropy.xyz");
    ApiPromise.create({ provider })
      .then((api) => {
        setApi(api);
        setApiStatus("connected");
        setShowSplash(false); // Hide splash on connect
      })
      .catch(() => {
        setApiStatus("error");
        setShowSplash(false); // Hide splash on error
      });
    // Hide splash after 5 seconds if not already hidden
    const timeout = setTimeout(() => setShowSplash(false), 5000);
    // Cleanup on unmount
    return () => {
      provider.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!api) return;
    let unsub: (() => void) | undefined;
    api.rpc.chain.subscribeNewHeads(async (header) => {
      setBlocks((prev) => {
        const newBlock = { number: header.number.toNumber(), hash: header.hash.toHex() };
        const updated = [newBlock, ...prev].slice(0, 10);
        return updated;
      });
    }).then((u) => { unsub = u; });
    return () => { if (unsub) unsub(); };
  }, [api]);

  const surfTheChain = async () => {
    if (!api) return;
    setSurfing(true);
    try {
      // Get latest block number
      const lastHeader = await api.rpc.chain.getHeader();
      const latest = lastHeader.number.toNumber();
      // Pick a random block number between 1 and latest
      const randomNumber = Math.floor(Math.random() * latest) + 1;
      // Get block hash for that number
      const hash = await api.rpc.chain.getBlockHash(randomNumber);
      const header = await api.rpc.chain.getHeader(hash);
      setRandomBlock({
        number: randomNumber,
        hash: hash.toHex(),
        parentHash: header.parentHash.toHex(),
      });
    } catch (e) {
      setRandomBlock(null);
    }
    setSurfing(false);
  };

  // Replace the unconditional SplashScreen with routing logic
  return (
    <>
      <ParticleField />
      <Routes>
        <Route
          path="/"
          element={
            <SplashScreen
              onSplashEnd={() => {
                setShowSplash(false);
                navigate("/home");
              }}
            />
          }
        />
        <Route
          path="/home"
          element={
            <div className="homepage-root">
              <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1>Welcome to Entropy</h1>
                <Button variant={"destructive"}>Click me</Button>
                <div className="mt-4">
                  <span className="font-mono text-sm">
                    {apiStatus === "connecting" && "Connecting to Entropy testnet..."}
                    {apiStatus === "connected" && "Connected to Entropy testnet!"}
                    {apiStatus === "error" && "Failed to connect to Entropy testnet."}
                  </span>
                </div>
                {apiStatus === "connected" && (
                  <>
                    <div className="mt-8 w-full max-w-xl bg-white rounded shadow p-4">
                      <h2 className="text-lg font-bold mb-2">Latest Blocks</h2>
                      <ul className="font-mono text-xs space-y-1">
                        {blocks.map((block) => (
                          <li key={block.hash} className="flex justify-between border-b last:border-b-0 py-1">
                            <span>#{block.number}</span>
                            <span className="truncate w-64 text-right">{block.hash}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="mt-8 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                      onClick={surfTheChain}
                      disabled={surfing}
                    >
                      {surfing ? "Surfing..." : "🌊 Surf the Chain!"}
                    </button>
                    {randomBlock && (
                      <div className="mt-6 w-full max-w-md bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
                        <h3 className="font-bold text-yellow-800 mb-2">You surfed to block #{randomBlock.number}!</h3>
                        <div className="font-mono text-xs">
                          <div><span className="font-bold">Hash:</span> {randomBlock.hash}</div>
                          <div><span className="font-bold">Parent Hash:</span> {randomBlock.parentHash}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </main>
            </div>
          }
        />
      </Routes>
    </>
  );
}
export default App;

