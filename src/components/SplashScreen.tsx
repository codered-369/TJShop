"use client";
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out smoothly at 1.5 seconds so it feels fast
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait 800ms for the smooth fade transition to finish
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#FDFBF7', // Luxury cream background
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s ease-in-out', // Smoother, slightly slower fade
      pointerEvents: isVisible ? 'all' : 'none',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px', // Scales nicely on desktop, fits perfectly on mobile
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <video 
          src="/splash.mp4" 
          autoPlay 
          muted 
          playsInline 
          ref={(el) => { if (el) el.playbackRate = 1.3; }} // Speeds up the video playback by 30%
          style={{ 
            width: '100%', 
            height: 'auto', 
            // The magic CSS trick: Fades the harsh edges perfectly into the background!
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
          }}
        />
      </div>
    </div>
  );
}
