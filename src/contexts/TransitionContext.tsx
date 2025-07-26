import { createContext, useContext, useState, ReactNode } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  transitionTheme: string;
  startTransition: (theme?: string) => void;
  endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTheme, setTransitionTheme] = useState("monochrome");

  const startTransition = (theme: string = "monochrome") => {
    setTransitionTheme(theme);
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
  };

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        transitionTheme,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
