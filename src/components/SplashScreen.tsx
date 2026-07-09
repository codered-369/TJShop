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
      backgroundColor: '#FDFBF7', // Matches luxury cream background
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: isVisible ? 'all' : 'none'
    }}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '500px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <video 
          src="/splash.mp4" 
          autoPlay 
          muted 
          playsInline 
          style={{ 
            width: '100%', 
            height: 'auto', 
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
          }}
        />
        
        {/* Flawless CSS Text Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          width: '100%',
          textAlign: 'center',
          animation: 'slideUpFade 1.5s ease-out forwards',
          animationDelay: '1s', // Wait for the turn-around animation
          opacity: 0
        }}>
          <h1 style={{ 
            color: 'var(--color-primary)', 
            fontFamily: 'var(--font-playfair)',
            fontSize: '2.2rem',
            margin: 0,
            letterSpacing: '1px',
            textShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            Tejaswini Selective Fabrics
          </h1>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
