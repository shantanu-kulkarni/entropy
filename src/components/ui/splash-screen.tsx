import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { dataLoader, PreloadedData } from "@/lib/data-loader";

const TITLE_TEXT = "Entropy";
const BLOCK_COUNT = TITLE_TEXT.length;
const BLOCK_WIDTH = 90; // px, adjusted for 8-bit font
const BLOCK_HEIGHT = 120; // px
const BLOCK_GAP = 12; // px, tighter for per-character
const TITLE_WIDTH = BLOCK_COUNT * BLOCK_WIDTH + (BLOCK_COUNT - 1) * BLOCK_GAP;
const TITLE_HEIGHT = 100; // px

// Accept an optional onSplashEnd prop with preloaded data
export function SplashScreen({ 
  onSplashEnd 
}: { 
  onSplashEnd?: (preloadedData: PreloadedData) => void 
}) {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // State to control when blocks have finished falling
  const [blocksFallen, setBlocksFallen] = useState(false);
  const [blocksGrow, setBlocksGrow] = useState(false);
  const [fullyCovered, setFullyCovered] = useState(false);
  const [dataLoadingProgress, setDataLoadingProgress] = useState(0);
  const [preloadedData, setPreloadedData] = useState<PreloadedData | null>(null);

  // Start data loading when component mounts
  useEffect(() => {
    const startDataLoading = async () => {
      try {
        console.log("Starting data preload during splash...");
        const data = await dataLoader.loadAllData();
        setPreloadedData(data);
        setDataLoadingProgress(100);
        console.log("Data preload completed during splash");
      } catch (error) {
        console.error("Failed to preload data during splash:", error);
        setDataLoadingProgress(100); // Mark as complete even on error
      }
    };

    startDataLoading();
  }, []);

  useEffect(() => {
    // Animate blocks falling in, then start oscillation
    let fallCount = 0;
    blockRefs.current.forEach((block, i) => {
      if (block) {
        gsap.fromTo(
          block,
          { y: -200, scale: 1 }, // start above
          {
            y: 0,
            scale: 1,
            duration: 0.7 + i * 0.08,
            ease: "power2.out",
            delay: i * 0.08,
            onComplete: () => {
              fallCount++;
              if (fallCount === BLOCK_COUNT) {
                // All blocks have fallen, start oscillation
                blockRefs.current.forEach((oscBlock, j) => {
                  if (oscBlock) {
                    gsap.to(oscBlock, {
                      y: 40,
                      repeat: -1,
                      yoyo: true,
                      duration: 1.1 + j * 0.08,
                      ease: "power1.inOut",
                      delay: 0,
                    });
                  }
                });
                setBlocksFallen(true);
              }
            },
          }
        );
      }
    });
  }, []);

  // Enhanced animated phrase at bottom right with data loading progress
  const phrases = [
    { base: "Setting your experience", end: "...", duration: 2000 },
    { base: "Connecting to the network", end: "...", duration: 2000 },
    { base: "Ready to surf the chain", end: "???", duration: 2000 },
    { base: "Let's Go", end: "!!!", duration: 4000 },
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [show, setShow] = useState(false);
  const [typedEnd, setTypedEnd] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Only start phrase animation after blocksFallen is true
  useEffect(() => {
    if (!blocksFallen) return;
    // Reset phrase animation state when blocksFallen becomes true
    setPhraseIdx(0);
    setShow(false);
    setTypedEnd("");
    setShowCursor(true);
    setAnimatingOut(false);
  }, [blocksFallen]);

  useEffect(() => {
    if (!blocksFallen) return;
    setShow(false);
    setTypedEnd("");
    setShowCursor(true);
    setAnimatingOut(false);
    // Entrance animation
    const inTimeout = setTimeout(() => {
      setShow(true);
      // Typewriter for ending
      let i = 0;
      const end = phrases[phraseIdx].end;
      function typeEnd() {
        if (i <= end.length - 1) {
          setTypedEnd(end.slice(0, i + 1));
          i++;
          setTimeout(typeEnd, 100);
        } else {
          // For "Let's Go!!!", don't cycle to next phrase - let it stay
          if (phrases[phraseIdx].base === "Let's Go") {
            // Keep "Let's Go!!!" on screen until user interaction
            return;
          }
          
          // Wait for duration, then move to next phrase (only for other phrases)
          setTimeout(() => {
            setAnimatingOut(true);
            setTimeout(() => {
              setPhraseIdx((prev) => (prev + 1) % phrases.length);
              setShow(false);
              setTypedEnd("");
              setShowCursor(true);
              setAnimatingOut(false);
            }, 400);
          }, phrases[phraseIdx].duration);
        }
      }
      typeEnd();
    }, 500);

    return () => clearTimeout(inTimeout);
  }, [blocksFallen, phraseIdx]);

  // Animate blocks growing when Let's Go!!! appears
  useEffect(() => {
    if (phrases[phraseIdx].base === "Let's Go" && blocksFallen && !blocksGrow) {
      setTimeout(() => {
        setBlocksGrow(true);
        // Animate blocks to grow and cover the screen
        blockRefs.current.forEach((block) => {
          if (block) {
            gsap.to(block, {
              y: 0,
              scaleX: 30,
              scaleY: 30,
              duration: 1.2,
              ease: "power2.inOut",
              onComplete: () => {
                setFullyCovered(true);
              },
            });
          }
        });
      }, 400); // slight delay for effect
    }
  }, [phraseIdx, blocksFallen, blocksGrow]);

  // Simple button click state
  const [buttonClicked, setButtonClicked] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // On button click, set transitioning to true immediately
  const handleButtonClick = () => {
    setTransitioning(true);
    setButtonClicked(true);
  };

  // Add state for button block assembly
  const [buttonBlocksAssembled, setButtonBlocksAssembled] = useState(false);
  const buttonAssembleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array when component mounts
  useEffect(() => {
    buttonAssembleRefs.current = Array.from(
      { length: "Leverage Entropy".length },
      () => null
    );
  }, []);

  // Animate button blocks assembling in
  useEffect(() => {
    if (fullyCovered && !buttonClicked && !buttonBlocksAssembled) {
      // Animate each block in sequence
      buttonAssembleRefs.current.forEach((block, i) => {
        if (block) {
          gsap.fromTo(
            block,
            { y: 40, opacity: 0, scale: 0.7 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.4,
              delay: i * 0.06 + 0.2,
              ease: "power2.out",
              onComplete: () => {
                if (i === "Leverage Entropy".length - 1) {
                  setButtonBlocksAssembled(true);
                }
              },
            }
          );
        }
      });
    }
    if (!fullyCovered || buttonClicked) {
      setButtonBlocksAssembled(false);
    }
  }, [fullyCovered, buttonClicked]);

  // Cube transition state
  const [fadeOut, setFadeOut] = useState(false);
  const [showCube, setShowCube] = useState(false);
  const [cubePulse, setCubePulse] = useState(false);
  const [cubeExpand, setCubeExpand] = useState(false);
  const [cubeTransitionStarted, setCubeTransitionStarted] = useState(false);
  const [showLetsGo, setShowLetsGo] = useState(false);
  const [letsGoFadeOut, setLetsGoFadeOut] = useState(false);

  // Trigger cube transition after button click (only once)
  useEffect(() => {
    if (buttonClicked && !cubeTransitionStarted) {
      setCubeTransitionStarted(true);

      // Single transition sequence with proper timing
      const transitionSequence = async () => {
        setFadeOut(true); // fade out immediately
        await new Promise((resolve) => setTimeout(resolve, 800));
        setShowCube(true); // show cube
        await new Promise((resolve) => setTimeout(resolve, 100));
        setCubePulse(true); // start pulse
        await new Promise((resolve) => setTimeout(resolve, 1100));
        setCubeExpand(true); // expand cube (screen turns white)
        await new Promise((resolve) => setTimeout(resolve, 500));
        setShowLetsGo(true); // show "Let's go!" text
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLetsGoFadeOut(true); // fade out "Let's go!" text
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (onSplashEnd && preloadedData) {
          onSplashEnd(preloadedData); // complete transition with preloaded data
        }
      };

      transitionSequence();
    }
  }, [buttonClicked, onSplashEnd, cubeTransitionStarted, preloadedData]);

  // Animation styles
  const phraseAnimStyle = {
    opacity: show && !animatingOut ? 1 : 0,
    transform: show && !animatingOut ? "translateY(0)" : "translateY(20px)",
    transition:
      "opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)",
    display: "inline-block",
  };

  // Fade-in style

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center splash-screen z-50 min-h-screen min-w-full`}
      style={{ background: transitioning ? "#000" : undefined }}
    >
      <div
        style={{
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          ref={containerRef}
          className="relative flex flex-col items-center justify-center"
          style={{
            width: TITLE_WIDTH,
            height: TITLE_HEIGHT * 2,
            marginTop: 40,
          }}
        >
          {/* Animated blocks absolutely positioned over the title */}
          <div
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <div
              className="flex"
              style={{ width: TITLE_WIDTH, height: TITLE_HEIGHT }}
            >
              {[...Array(BLOCK_COUNT)].map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (blockRefs.current[i] = el)}
                  style={{
                    width: BLOCK_WIDTH,
                    height: BLOCK_HEIGHT,
                    marginRight: i !== BLOCK_COUNT - 1 ? BLOCK_GAP : 0,
                    background: "#000",
                    borderRadius: 10,
                    position: "relative",
                    zIndex: 2,
                    transition: blocksGrow ? "none" : undefined,
                  }}
                />
              ))}
            </div>
          </div>
          {/* Title with blend mode */}
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: TITLE_HEIGHT * 2,
              opacity: fullyCovered ? 1 : 1,
              transition: "opacity 0.5s",
            }}
          >
            <span
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 80,
                color: fullyCovered ? "#fff" : "#fff",
                letterSpacing: 8,
                mixBlendMode: "difference",
                zIndex: 3,
                position: "relative",
                userSelect: "none",
              }}
            >
              {TITLE_TEXT}
            </span>
          </div>
          {/* 'surf the wave' below the blocks */}
          <div
            className="w-full flex flex-col items-center justify-center"
            style={{
              marginTop: 16,
              opacity: blocksFallen ? 1 : 0,
              transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <span
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 24,
                color: fullyCovered ? "#fff" : "#fff",
                letterSpacing: 4,
                mixBlendMode: fullyCovered ? "normal" : "difference",
                zIndex: 3,
                position: "relative",
                userSelect: "none",
                background: "none",
                //transition: 'color 0.5s, mix-blend-mode 0.5s'
                transform: blocksFallen
                  ? "translateY(0) color 0.5s, mix-blend-mode 0.5s"
                  : "translateY(20px) color 0.5s, mix-blend-mode 0.5s",
                transition:
                  "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              surf the chain!
            </span>
          </div>
          {/* Leverage Entropy button */}
          {fullyCovered && !buttonClicked && (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `calc(${TITLE_HEIGHT * 2 + 56}px)`,
                display: "flex",
                justifyContent: "center",
                zIndex: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 16px 0 #0006",
                  cursor: "pointer",
                  transition: "transform 0.18s cubic-bezier(0.4,0,0.2,1)",
                  transform: "scale(1)",
                }}
                onClick={handleButtonClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {[..."Leverage Entropy"].map((char, i, arr) => (
                  <div
                    key={i}
                    ref={(el) => (buttonAssembleRefs.current[i] = el)}
                    style={{
                      width: 24,
                      height: 48,
                      marginRight: 0,
                      background: "#fff",
                      borderTopLeftRadius: i === 0 ? 12 : 0,
                      borderBottomLeftRadius: i === 0 ? 12 : 0,
                      borderTopRightRadius: i === arr.length - 1 ? 12 : 0,
                      borderBottomRightRadius: i === arr.length - 1 ? 12 : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 18,
                      color: "#000",
                      boxShadow: "none",
                      opacity: 0,
                      transform: "translateY(40px) scale(0.7)",
                      transition: "none",
                      zIndex: 31,
                      position: "relative",
                    }}
                  >
                    {char !== " " ? char : "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Bottom right enhanced animated phrase */}
        {blocksFallen && (
          <div
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
              padding: "14px 18px",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 14,
              color: "#000",
              zIndex: 100,
              pointerEvents: "none",
              width: "100vw",
              letterSpacing: 1,
              textShadow: "0 0 2px #fff, 0 0 1px #fff",
              textAlign: "right",
              userSelect: "none",
              opacity: blocksGrow ? 0 : 1,
              transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <span style={phraseAnimStyle}>
              {phrases[phraseIdx].base}
              <span>
                {typedEnd}
                {showCursor &&
                  typedEnd.length < phrases[phraseIdx].end.length && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "1ch",
                        animation: "robotic-blink 0.7s steps(1) infinite",
                        color: "#0ff",
                        textShadow: "0 0 4px #0ff",
                      }}
                    >
                      |
                    </span>
                  )}
              </span>
            </span>
          </div>
        )}
      </div>
      {/* Cube transition animation */}
      {showCube && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            background: "#000",
          }}
        >
          <div
            style={{
              width: cubeExpand ? "100vw" : 80,
              height: cubeExpand ? "100vh" : 80,
              background: "#fff",
              borderRadius: cubeExpand ? 0 : 16,
              boxShadow: cubeExpand
                ? "none"
                : "0 0 40px 10px #22c55e, 0 0 80px 20px #22c55e44",
              transition: "all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              animation: cubePulse
                ? "smoothBlink 0.8s ease-in-out infinite"
                : "none",
              position: "relative",
            }}
          >
            {/* "Let's surf!" text overlay */}
            {cubePulse && !cubeExpand && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 12,
                  color: "#000",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  opacity: cubePulse ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out",
                  zIndex: 1001,
                  textShadow: "0 0 2px #fff",
                  animation: "textPulse 0.8s ease-in-out infinite",
                }}
              >
                Let's surf!
              </div>
            )}
          </div>
        </div>
      )}

      {/* "Let's go!" text overlay on white screen */}
      {showLetsGo && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1002,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            background: "transparent",
          }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 48,
              color: "#000",
              textAlign: "center",
              whiteSpace: "nowrap",
              opacity: letsGoFadeOut ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
              textShadow: "0 0 4px rgba(0,0,0,0.1)",
              animation: letsGoFadeOut ? "none" : "letsGoAppear 0.5s ease-out",
            }}
          >
            Let's go!
          </div>
        </div>
      )}
      <style>{`
        @keyframes smoothBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        @keyframes textPulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes letsGoAppear {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes robotic-blink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
