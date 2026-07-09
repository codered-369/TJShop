"use client";
import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function SplashScreenWrapper() {
  const [showSplash, setShowSplash] = useState(true);

  if (!showSplash) return null;

  return <SplashScreen onComplete={() => setShowSplash(false)} />;
}
