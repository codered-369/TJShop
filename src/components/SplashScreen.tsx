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
      backgroundColor: '#FDFBF7', // Always use cream as the base for seamless fade
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: isVisible ? 'all' : 'none',
      overflow: 'hidden'
    }}>
      
      {/* DESKTOP VIEW: The Cinematic Video */}
      <video 
        className="splash-video-desktop"
        src="/splash.mp4" 
        autoPlay 
        muted 
        playsInline 
        ref={(el) => { if (el) el.playbackRate = 1.3; }}
      />
      
      {/* MOBILE VIEW: The Circular Video Badge */}
      <div className="splash-mobile-animation">
        <div className="circular-video-wrapper">
          <video 
            src="/splash.mp4" 
            autoPlay 
            muted 
            playsInline 
            ref={(el) => { if (el) el.playbackRate = 1.3; }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Desktop Video Styles */
        .splash-video-desktop {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: cinematicZoom 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          display: block;
        }

        /* Mobile Animation Container */
        .splash-mobile-animation {
          display: none;
          position: relative;
          width: 100%;
          height: 100%;
          background: #FDFBF7; /* Pure luxury cream */
          justify-content: center;
          align-items: center;
        }

        .circular-video-wrapper {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(133, 28, 44, 0.2); /* Deep maroon shadow */
          border: 4px solid #fff;
          animation: circularElegance 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* Media Query to switch views */
        @media (max-width: 768px) {
          .splash-video-desktop {
            display: none !important; /* Completely hide the clunky horizontal video on mobile */
          }
          .splash-mobile-animation {
            display: flex !important; /* Show the beautiful native CSS animation */
          }
        }

        @keyframes cinematicZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes circularElegance {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}} />
    </div>
  );
}
