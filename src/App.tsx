// src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import PosterComposition from './components/PosterComposition';
import Controls from './components/Controls';
import Metadata from './components/Metadata';
import SplashScreen from './components/SplashScreen';
import Countdown from './components/Countdown';
import { useAudio } from './hooks/useAudio';
import { SettingsProvider } from './context/SettingsContext';

type ViewMode = 'original' | 'bilingual' | 'translation';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('bilingual');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false); // Keep state if needed elsewhere
  const [showMetadata, setShowMetadata] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState<boolean>(true);
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);
  
  // Audio setup
  const audioSrc = '/music/Robinson.mp3'; 
  const { currentTime, duration, isPlaying, isLoaded, togglePlay, seek } = useAudio(audioSrc);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowCountdown(true);
  };

  // Handle countdown completion
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setTimeout(() => {
      if (!isPlaying) togglePlay();
    }, 300);
  };

  // Toggle view mode (still needed for keyboard shortcut V)
  const toggleViewMode = useCallback(() => {
    const modes: ViewMode[] = ['original', 'bilingual', 'translation'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  }, [viewMode]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard controls during splash and countdown
      if (showSplash || showCountdown) return;
      
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      } else if (e.key === 'v' || e.key === 'V') {
        toggleViewMode();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H') {
        setShowMetadata(prev => !prev);
      } else if (e.key === '?') {
        setShowKeyboardHint(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, duration, toggleViewMode, toggleFullscreen, showSplash, showCountdown]);

  return (
    <SettingsProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-background">
        {/* Splash Screen */}
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        
        {/* Countdown */}
        {showCountdown && <Countdown onComplete={handleCountdownComplete} duration={5} />}
        
        {/* Main Content - only shown after splash and countdown */}
        {!showSplash && !showCountdown && (
          <>
            {/* Poster Composition Engine - Unified background + lyrics */}
            <PosterComposition 
              currentTime={currentTime} 
              viewMode={viewMode}
              isPlaying={isPlaying}
            />
            
            {/* Metadata Display */}
            <Metadata 
              visible={showMetadata} 
              currentTime={currentTime} 
            />
            
            {/* Controls - viewMode props removed (now in Settings) */}
            <Controls
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onSeek={seek}
              currentTime={currentTime}
              duration={duration}
              onFullscreen={toggleFullscreen}
              onToggleMetadata={() => setShowMetadata(prev => !prev)}
              isFullscreen={isFullscreen}
              onVisibilityToggle={setAreControlsVisible}
            />
          </>
        )}
        
        {/* Loading Indicator */}
        {!isLoaded && !showSplash && !showCountdown && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-primary/10 rotate-45" />
                <div className="absolute inset-2 border-2 border-primary/10 rotate-0" />
                <div className="absolute inset-4 border-2 border-primary/10 -rotate-45" />
                <motion.div
                  className="absolute inset-0 border-t-2 border-accent/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span className="text-secondary/40 text-[10px] tracking-[0.2em] font-light uppercase">
                Loading...
              </span>
            </div>
          </div>
        )}
        
        {/* Keyboard Shortcuts Hint - Hide when controls are hidden */}
        {!showSplash && !showCountdown && showKeyboardHint && areControlsVisible && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 opacity-0 hover:opacity-100 transition-opacity duration-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <div className="text-secondary/20 text-[8px] tracking-[0.2em] font-light uppercase flex items-center gap-3 bg-background/50 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/5">
              <span>SPACE</span>
              <span className="w-px h-3 bg-secondary/10" />
              <span>← →</span>
              <span className="w-px h-3 bg-secondary/10" />
              <span>V</span>
              <span className="w-px h-3 bg-secondary/10" />
              <span>H</span>
              <span className="w-px h-3 bg-secondary/10" />
              <span>F</span>
              <span className="w-px h-3 bg-secondary/10" />
              <span>?</span>
            </div>
          </motion.div>
        )}
        
        {/* Constructivist Corner Decorations */}
        {!showSplash && (
          <div className="fixed inset-0 pointer-events-none z-5">
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/5" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/5" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/5" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/5" />
          </div>
        )}
        
        {/* Subtle Diagonal Accent Lines */}
        {!showSplash && !showCountdown && (
          <div className="fixed inset-0 pointer-events-none z-5">
            <motion.div
              className="absolute top-0 right-[20%] w-px h-32 bg-primary/5 origin-top-right -rotate-45"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-[30%] w-px h-32 bg-primary/5 origin-bottom-left -rotate-45"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            />
          </div>
        )}
      </div>
    </SettingsProvider>
  );
};

export default App;