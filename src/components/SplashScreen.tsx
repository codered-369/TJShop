"use client";
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1.5 seconds total duration for a snappy experience
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); 
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
      backgroundColor: '#000',
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)', // Buttery smooth fade
      pointerEvents: isVisible ? 'all' : 'none',
      overflow: 'hidden'
    }}>
      
      {/* Ambient Blur Background (The "Cool & Sexy" Aura Effect) */}
      <video 
        src="/splash.mp4" 
        autoPlay 
        muted 
        playsInline 
        ref={(el) => { if (el) el.playbackRate = 1.3; }}
        style={{ 
          position: 'absolute',
          width: '150%', 
          height: '150%', 
          objectFit: 'cover',
          filter: 'blur(50px) brightness(0.5)',
          transform: 'scale(1.1)',
          zIndex: 1
        }}
      />
      
      {/* The crisp, centered main video */}
      <video 
        className="splash-video-main"
        src="/splash.mp4" 
        autoPlay 
        muted 
        playsInline 
        ref={(el) => { if (el) el.playbackRate = 1.3; }}
        style={{ 
          position: 'relative',
          zIndex: 2,
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        .splash-video-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: cinematicZoom 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @media (max-width: 768px) {
          .splash-video-main {
            width: 100%;
            height: auto;
            object-fit: contain;
            box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          }
        }
        @keyframes cinematicZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}} />
    </div>
  );
}
