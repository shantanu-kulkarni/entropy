import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
// Remove: import { useNavigate } from "react-router-dom";

const TITLE_TEXT = "Entropy";
const BLOCK_COUNT = TITLE_TEXT.length;
const BLOCK_WIDTH = 90; // px, adjusted for 8-bit font
const BLOCK_HEIGHT = 120; // px
const BLOCK_GAP = 12; // px, tighter for per-character
const TITLE_WIDTH = BLOCK_COUNT * BLOCK_WIDTH + (BLOCK_COUNT - 1) * BLOCK_GAP;
const TITLE_HEIGHT = 100; // px

// Accept an optional onSplashEnd prop
export function SplashScreen({ onSplashEnd }: { onSplashEnd?: () => void }) {
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // State to control when blocks have finished falling
  const [blocksFallen, setBlocksFallen] = useState(false);
  const [blocksGrow, setBlocksGrow] = useState(false);
  const [fullyCovered, setFullyCovered] = useState(false);
  // Remove: const navigate = useNavigate ? useNavigate() : () => {};

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

  // Enhanced animated phrase at bottom right
  const phrases = [
    { base: "Setting your experience", end: "...", duration: 2000 },
    { base: "Connecting to the network", end: "...", duration: 2000 },
    { base: "Ready to surf the wave", end: "???", duration: 2000 },
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
          // Randomize interval for more natural effect
          setTimeout(typeEnd, 80 + Math.random() * 60);
        } else {
          setShowCursor(false);
        }
      }
      typeEnd();
    }, 200);
    // Animate out before switching
    const outTimeout = setTimeout(() => {
      setAnimatingOut(true);
      setTimeout(() => {
        setShow(false);
        setTypedEnd("");
        setShowCursor(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
      }, 400); // match out animation duration
    }, phrases[phraseIdx].duration);
    return () => {
      clearTimeout(inTimeout);
      clearTimeout(outTimeout);
    };
  }, [phraseIdx, blocksFallen]);

  // Animate blocks growing when Let's Go!!! appears
  useEffect(() => {
    if (phrases[phraseIdx].base === "Let's Go" && blocksFallen && !blocksGrow) {
      setTimeout(() => {
        setBlocksGrow(true);
        // Animate blocks to grow and cover the screen
        blockRefs.current.forEach((block, i) => {
          if (block) {
            gsap.to(block, {
              y: 0,
              scaleX: 30,
              scaleY: 30,
              duration: 1.2,
              ease: "power2.inOut",
              onComplete: () => {
                setFullyCovered(true);
              }
            });
          }
        });
      }, 400); // slight delay for effect
    }
  }, [phraseIdx, blocksFallen, blocksGrow]);

  // Add state for button explosion
  const [buttonExplode, setButtonExplode] = useState(false);
  const buttonBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [buttonBlocksGrow, setButtonBlocksGrow] = useState(false);
  const [buttonFullyCovered, setButtonFullyCovered] = useState(false);

  // Animate button blocks growing to cover the screen (more subtle)
  useEffect(() => {
    if (buttonExplode && !buttonBlocksGrow) {
      setTimeout(() => {
        setButtonBlocksGrow(true);
        buttonBlockRefs.current.forEach((block, i) => {
          if (block) {
            gsap.to(block, {
              y: 0,
              scaleX: 6, // less dramatic
              scaleY: 6, // less dramatic
              duration: 0.8, // faster and smoother
              ease: "power1.inOut",
              onComplete: () => {
                setButtonFullyCovered(true);
              }
            });
          }
        });
      }, 200);
    }
  }, [buttonExplode, buttonBlocksGrow]);

  // When button blocks fully cover, fade to white and call onSplashEnd
  useEffect(() => {
    if (buttonFullyCovered) {
      setTimeout(() => {
        if (onSplashEnd) onSplashEnd();
      }, 400);
    }
  }, [buttonFullyCovered, onSplashEnd]);

  // After fully covered, wait 5s and trigger callback
  // Remove this effect:
  // useEffect(() => {
  //   if (fullyCovered) {
  //     const timeout = setTimeout(() => {
  //       if (onSplashEnd) onSplashEnd();
  //     }, 5000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [fullyCovered, onSplashEnd]);

  // Animation styles
  const phraseAnimStyle = {
    opacity: show && !animatingOut ? 1 : 0,
    transform: show && !animatingOut ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
    display: 'inline-block',
  };

  // Fade-in style
  const fadeStyle = {
    opacity: show ? 1 : 0,
    transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
    display: 'inline',
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 z-50 min-h-screen min-w-full">
      <div
        ref={containerRef}
        className="relative flex flex-col items-center justify-center"
        style={{ width: TITLE_WIDTH, height: TITLE_HEIGHT * 2, marginTop: 40 }}
      >
        {/* Animated blocks absolutely positioned over the title */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
          <div className="flex" style={{ width: TITLE_WIDTH, height: TITLE_HEIGHT }}>
            {[...Array(BLOCK_COUNT)].map((_, i) => (
              <div
                key={i}
                ref={el => (blockRefs.current[i] = el)}
                style={{
                  width: BLOCK_WIDTH,
                  height: BLOCK_HEIGHT,
                  marginRight: i !== BLOCK_COUNT - 1 ? BLOCK_GAP : 0,
                  background: "#000",
                  borderRadius: 10,
                  position: "relative",
                  zIndex: 2,
                  transition: blocksGrow ? 'none' : undefined
                }}
              />
            ))}
          </div>
        </div>
        {/* Title with blend mode */}
        <div
          className="w-full flex items-center justify-center"
          style={{ height: TITLE_HEIGHT * 2, opacity: fullyCovered ? 1 : 1, transition: 'opacity 0.5s' }}
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
          style={{ marginTop: 16, opacity: blocksFallen ? 1 : 0, transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)' }}
        >
          <span
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 24,
              color: fullyCovered ? "#fff" : "#000",
              letterSpacing: 4,
              mixBlendMode: fullyCovered ? "normal" : "difference",
              zIndex: 3,
              position: "relative",
              userSelect: "none",
              background: 'none',
              transition: 'color 0.5s, mix-blend-mode 0.5s'
            }}
          >
            surf the wave
          </span>
        </div>
        {/* Leverage Entropy button absolutely below title/subtitle, only when fullyCovered */}
        {fullyCovered && !buttonExplode && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `calc(${TITLE_HEIGHT * 2 + 56}px)`,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 20
            }}
          >
            <button
              onClick={() => setButtonExplode(true)}
              style={{
                padding: '16px 40px',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 18,
                background: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                boxShadow: '0 2px 16px 0 #0006',
                letterSpacing: 2,
                transition: 'background 0.2s, color 0.2s, transform 0.18s cubic-bezier(0.4,0,0.2,1)',
                zIndex: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Leverage Entropy
            </button>
          </div>
        )}
        {/* Button block explosion animation */}
        {fullyCovered && buttonExplode && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `calc(${TITLE_HEIGHT * 2 + 56}px)`,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 30,
              width: 400,
              margin: '0 auto',
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex' }}>
              {[...'Leverage Entropy'].map((char, i) => (
                <div
                  key={i}
                  ref={el => (buttonBlockRefs.current[i] = el)}
                  style={{
                    width: 24,
                    height: 48,
                    marginRight: i !== 'Leverage Entropy'.length - 1 ? 4 : 0,
                    background: '#fff',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 18,
                    color: '#000',
                    boxShadow: '0 2px 8px 0 #0003',
                    transition: buttonBlocksGrow ? 'none' : undefined,
                    zIndex: 31,
                    position: 'relative',
                  }}
                >
                  {char !== ' ' ? char : '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* White overlay as button blocks grow */}
        {fullyCovered && buttonExplode && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: '#fff',
              opacity: buttonBlocksGrow ? 1 : 0,
              pointerEvents: 'none',
              zIndex: 1000,
              transition: 'opacity 0.8s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
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
            transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <span style={phraseAnimStyle}>
            {phrases[phraseIdx].base}
            <span>
              {typedEnd}
              {showCursor && typedEnd.length < phrases[phraseIdx].end.length && (
                <span style={{
                  display: 'inline-block',
                  width: '1ch',
                  animation: 'robotic-blink 0.7s steps(1) infinite',
                  color: '#0ff',
                  textShadow: '0 0 4px #0ff',
                }}>|</span>
              )}
            </span>
          </span>
        </div>
      )}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes robotic-blink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
} 