"use client";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function SplashScreenWrapper() {
  const [showSplash, setShowSplash] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hasSeenSplash = sessionStorage.getItem('splashSeen');
    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('splashSeen', 'true');
    setShowSplash(false);
  };

  if (!isClient) return null; // Avoid hydration mismatch
  if (!showSplash) return null;

  return <SplashScreen onComplete={handleComplete} />;
}
