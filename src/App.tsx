import { useState, useEffect } from "react";
import "./App.css";
import { SplashScreen } from "@/components/ui/splash-screen";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Home } from "@/layout/Home";
import { Theme } from "@/types";
import { TransitionProvider, useTransition } from "@/contexts/TransitionContext";
import { TransitionOverlay } from "@/components/ui/transition-overlay";

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [globalTheme, setGlobalTheme] = useState<Theme>("monochrome");
  const { isTransitioning, transitionTheme, startTransition, endTransition } = useTransition();
  const navigate = useNavigate();

  // Add/remove transition-active class to body
  useEffect(() => {
    if (isTransitioning) {
      document.body.classList.add('transition-active');
    } else {
      document.body.classList.remove('transition-active');
    }

    return () => {
      document.body.classList.remove('transition-active');
    };
  }, [isTransitioning]);

  const handleSplashEnd = () => {
    startTransition(globalTheme);
    // Navigate immediately to prevent white flash
    setShowSplash(false);
    navigate("/home");
  };

  const handleThemeChange = (theme: Theme) => {
    setGlobalTheme(theme);
  };

  const handleTransitionComplete = () => {
    endTransition();
  };

  return (
    <>
      <TransitionOverlay isActive={isTransitioning} theme={transitionTheme} onComplete={handleTransitionComplete} />
      <Routes>
        <Route
          path="/"
          element={
            <SplashScreen onSplashEnd={handleSplashEnd} />
          }
        />
        <Route
          path="/home"
          element={
            <Home onThemeChange={handleThemeChange} />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <TransitionProvider>
      <AppContent />
    </TransitionProvider>
  );
}

export default App;

