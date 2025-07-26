import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const PARTICLE_COUNT = 80;
const PARTICLE_SIZE = 6; // px, bigger

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type Particle = {
  x: number;
  ref: React.RefObject<HTMLDivElement>;
};

export const ParticleField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      x: random(0, window.innerWidth),
      ref: React.createRef<HTMLDivElement>(),
    }))
  );

  useEffect(() => {
    function fall(p: Particle) {
      if (!p.ref.current) return;
      const startY = random(-100, -40); // start above the screen
      const endY = window.innerHeight + 40;
      const duration = random(4, 8); // slower fall
      gsap.set(p.ref.current, {
        x: p.x,
        y: startY,
        opacity: random(0.5, 1),
      });
      gsap.to(p.ref.current, {
        y: endY,
        duration,
        ease: "power1.in",
        onComplete: () => fall(p), // loop
      });
    }
    particles.current.forEach((p) => {
      fall(p);
    });
    // Clean up on unmount
    return () => {
      particles.current.forEach((p) => {
        if (p.ref.current) gsap.killTweensOf(p.ref.current);
      });
    };
  }, []);

  // Responsive: update bounds on resize
  useEffect(() => {
    function handleResize() {
      // Optionally, you could re-randomize positions or update bounds
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {particles.current.map((p, i) => (
        <div
          key={i}
          ref={p.ref}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PARTICLE_SIZE,
            height: PARTICLE_SIZE,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            boxShadow: "0 0 8px 2px #fff8",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}; 
