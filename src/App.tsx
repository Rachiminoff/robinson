import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import InteractiveBackground from './components/InteractiveBackground';
import NoiseOverlay from './components/NoiseOverlay';
import Metadata from './components/Metadata';
import Timeline from './components/Timeline';
import LyricsStage from './components/LyricsStage';
import Controls from './components/Controls';
import GridOverlay from './components/GridOverlay';
import SplashScreen from './components/SplashScreen';
import Countdown from './components/Countdown';
import BackgroundPulse from './components/BackgroundPulse';
import { ViewMode } from './types';
import { useAudio } from './hooks/useAudio';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('bilingual');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showMetadata, setShowMetadata] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [audioStarted, setAudioStarted] = useState<boolean>(false);
  
  // Change this to your actual MP3 file path
  // Place your MP3 in public/music/Robinson.mp3
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
    setAudioStarted(true);
    // Auto-start playback when countdown ends
    setTimeout(() => {
      if (!isPlaying) {
        togglePlay();
      }
    }, 300);
  };

  const toggleViewMode = useCallback(() => {
    const modes: ViewMode[] = ['original', 'bilingual', 'translation'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  }, [viewMode]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const controls = useMemo(() => ({
    togglePlay,
    seek,
    currentTime,
    duration,
    toggleFullscreen,
    toggleViewMode,
  }), [togglePlay, seek, currentTime, duration, toggleFullscreen, toggleViewMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip keyboard controls during splash and countdown
      if (showSplash || showCountdown) return;
      
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        controls.togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        controls.seek(Math.max(0, controls.currentTime - 5));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        controls.seek(Math.min(controls.duration, controls.currentTime + 5));
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        setShowMetadata((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        controls.toggleFullscreen();
      } else if (e.key === 'v' || e.key === 'V') {
        controls.toggleViewMode();
      } else if (e.key === '?') {
        // Show keyboard shortcuts help
        // You can implement a help modal here
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controls, showSplash, showCountdown]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      
      {/* Countdown */}
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} duration={5} />
      )}
      
      {/* Background Pulse - Beat responsive background */}
      {!showSplash && !showCountdown && (
        <BackgroundPulse isPlaying={isPlaying} currentTime={currentTime} />
      )}
      
      {/* Background layers - only show after splash */}
      {!showSplash && (
        <>
          <InteractiveBackground showGrid={showGrid} />
          <NoiseOverlay />
          <GridOverlay visible={showGrid} />
        </>
      )}
      
      {/* Main content - only show after countdown */}
      {!showSplash && !showCountdown && (
        <>
          <LyricsStage currentTime={currentTime} viewMode={viewMode} />
          
          <Metadata visible={showMetadata} currentTime={currentTime} />
          
          <Timeline currentTime={currentTime} duration={duration} />
          
          <Controls
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onSeek={seek}
            currentTime={currentTime}
            duration={duration}
            onFullscreen={toggleFullscreen}
            onToggleGrid={() => setShowGrid((prev) => !prev)}
            onToggleMetadata={() => setShowMetadata((prev) => !prev)}
            isFullscreen={isFullscreen}
          />
        </>
      )}
      
      {/* Loading indicator */}
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
      
      {/* View mode indicator - only show after countdown */}
      {!showSplash && !showCountdown && (
        <motion.div
          className="fixed top-8 right-8 z-30 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={toggleViewMode}
            className="group relative text-secondary/40 hover:text-secondary/60 transition-colors text-[10px] tracking-[0.15em] font-light uppercase border border-primary/10 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm"
          >
            <span className="relative z-10">{viewMode}</span>
            <span className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-colors duration-500 rounded-full" />
          </button>
        </motion.div>
      )}
      
      {/* Keyboard shortcuts hint - only show after countdown */}
      {!showSplash && !showCountdown && (
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
            <span>G</span>
            <span className="w-px h-3 bg-secondary/10" />
            <span>H</span>
            <span className="w-px h-3 bg-secondary/10" />
            <span>F</span>
            <span className="w-px h-3 bg-secondary/10" />
            <span>V</span>
          </div>
        </motion.div>
      )}
      
      {/* Constructivist corner decorations - only show after splash */}
      {!showSplash && (
        <div className="fixed inset-0 pointer-events-none z-5">
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/5" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/5" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/5" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/5" />
        </div>
      )}
      
      {/* Subtle diagonal accent lines */}
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
      
      {/* Current lyric counter - subtle indicator */}
      {!showSplash && !showCountdown && isLoaded && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 text-[7px] text-secondary/10 tracking-[0.3em] font-light uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="font-mono tracking-widest">
            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
          </span>
          <span className="mx-2 text-secondary/5">•</span>
          <span className="font-mono tracking-widest">
            {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
          </span>
        </motion.div>
      )}
    </div>
  );
};
export default App;