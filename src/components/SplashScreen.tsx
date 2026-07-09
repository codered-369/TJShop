"use client";
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // The video is 2 seconds long. Give it 2.5s total to read text then fade out.
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // 500ms fade transition
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000', // Cinematic black background
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: isVisible ? 'all' : 'none',
      overflow: 'hidden'
    }}>
      <video 
        src="/splash.mp4" 
        autoPlay 
        muted 
        playsInline 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover'
        }}
      />
    </div>
  );
}
