import { useEffect, useRef } from "react";
import gsap from "gsap";

interface TransitionOverlayProps {
  isActive: boolean;
  theme: string;
  onComplete: () => void;
}

export function TransitionOverlay({ isActive, theme, onComplete }: TransitionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);

  // Theme-based color functions
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "light":
        return {
          blockColor: "#3b82f6",
          glowColor: "rgba(59, 130, 246, 0.6)"
        };
      case "dark":
        return {
          blockColor: "#8b5cf6",
          glowColor: "rgba(139, 92, 246, 0.6)"
        };
      case "retro":
        return {
          blockColor: "#22c55e",
          glowColor: "rgba(34, 197, 94, 0.6)"
        };
      case "monochrome":
      default:
        return {
          blockColor: "#ffffff",
          glowColor: "rgba(255, 255, 255, 0.6)"
        };
    }
  };

  useEffect(() => {
    if (!isActive || !overlayRef.current || !blocksRef.current) return;

    const overlay = overlayRef.current;
    const blocks = blocksRef.current;
    const colors = getThemeColors(theme);

    // Create a timeline for the transition
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    // Step 1: Create expanding blocks from center with glow effect
    tl.to(blocks, {
      scale: 1,
      opacity: 1,
      backgroundColor: colors.blockColor,
      boxShadow: `0 0 20px ${colors.glowColor}`,
      duration: 0.1,
      ease: "power2.out"
    })
    // Step 2: Expand blocks to cover screen (simplified)
    .to(blocks, {
      scale: 40,
      duration: 0.8,
      ease: "power2.inOut"
    })
    // Step 3: Keep black background and fade out the overlay
    .to(overlay, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
    };
  }, [isActive, theme, onComplete]);

  if (!isActive) return null;

  const colors = getThemeColors(theme);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={blocksRef}
        className="w-8 h-8 rounded-lg opacity-0 scale-0"
        style={{
          backgroundColor: colors.blockColor,
          boxShadow: `0 0 20px ${colors.glowColor}`,
          borderRadius: '4px'
        }}
      />
    </div>
  );
} 