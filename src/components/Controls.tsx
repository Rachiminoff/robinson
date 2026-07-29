import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  Eye,
  EyeOff,
  Settings,
} from 'lucide-react';
import SettingsPanel from './SettingsPanel';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  duration: number;
  onFullscreen: () => void;
  onToggleMetadata: () => void;
  isFullscreen?: boolean;
  onVisibilityToggle?: (visible: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onSeek,
  currentTime,
  duration,
  onFullscreen,
  onToggleMetadata,
  isFullscreen = false,
  onVisibilityToggle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const x = useSpring(0, { damping: 25, stiffness: 100 });
  const y = useSpring(0, { damping: 25, stiffness: 100 });

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle visibility with useCallback to stabilize the function reference
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => {
      const newValue = !prev;
      onVisibilityToggle?.(newValue);
      return newValue;
    });
  }, [onVisibilityToggle]);

  // Keyboard shortcut for toggling visibility (Ctrl/Cmd + H)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        toggleVisibility();
      }
      // Settings shortcut (Ctrl/Cmd + ,)
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleVisibility]);

  // Auto-hide on PC when not hovering
  useEffect(() => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (!isMobile && !isHovered) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onVisibilityToggle?.(false);
      }, 3000);
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isHovered, isMobile, onVisibilityToggle]);

  // Show controls on mouse movement on PC
  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = () => {
        setIsVisible(true);
        onVisibilityToggle?.(true);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile, onVisibilityToggle]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Touch swipe handling for mobile - seeking
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      e.preventDefault();
      const seekAmount = (deltaX / window.innerWidth) * duration;
      const newTime = Math.max(0, Math.min(duration, currentTime + seekAmount));
      onSeek(newTime);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSwiping) {
      e.preventDefault();
    }
    setIsSwiping(false);
  };

  return (
    <>
      {/* Toggle button for mobile - compact */}
      {isMobile && (
        <motion.button
          onClick={toggleVisibility}
          className="fixed top-3 right-3 z-40 p-2.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/10 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-label="Toggle controls"
        >
          {isVisible ? (
            <EyeOff className="w-4 h-4 text-secondary/60" />
          ) : (
            <Eye className="w-4 h-4 text-secondary/60" />
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`fixed ${
              isMobile 
                ? 'bottom-0 left-0 right-0 px-3 pb-3 pt-2' 
                : 'bottom-8 left-1/2 -translate-x-1/2'
            } z-30 select-none`}
            initial={{ opacity: 0, y: isMobile ? 30 : 30, scale: isMobile ? 1 : 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: !isMobile ? x.get() : 0,
            }}
            exit={{ opacity: 0, y: isMobile ? 30 : 30, scale: isMobile ? 1 : 0.9 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2, 
              ease: [0.22, 1, 0.36, 1],
              type: "spring",
              damping: 25,
              stiffness: 80
            }}
            style={!isMobile ? { x, y } : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative">
              {/* Mobile background gradient - subtle */}
              {isMobile && (
                <div className="absolute -inset-3 bg-gradient-to-t from-background/90 via-background/40 to-transparent rounded-2xl" />
              )}
              
              <div className={`relative flex items-center gap-1.5 px-2 py-1.5 bg-background/95 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-black/50 ${
                isMobile ? 'rounded-2xl' : 'rounded-full'
              }`}>
                {/* Play/Pause */}
                <motion.button
                  onClick={onTogglePlay}
                  className={`flex items-center justify-center rounded-full bg-accent/20 hover:bg-accent/30 transition-colors group flex-shrink-0 ${
                    isMobile ? 'w-10 h-10' : 'w-10 h-10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  animate={{
                    boxShadow: isPlaying ? '0 0 20px rgba(233,69,96,0.15)' : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} text-accent`} />
                  ) : (
                    <Play className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'} text-accent ml-0.5`} />
                  )}
                </motion.button>

                {!isMobile && <div className="w-px h-6 bg-primary/10" />}

                {/* Seek controls */}
                <div className={`flex items-center gap-0.5 ${isMobile ? 'flex-1 justify-center min-w-0' : ''}`}>
                  {!isMobile && (
                    <motion.button
                      onClick={() => onSeek(Math.max(0, currentTime - 5))}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/40 hover:text-secondary/60 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Seek backward 5 seconds"
                    >
                      <SkipBack className="w-3 h-3" />
                    </motion.button>
                  )}
                  
                  {/* Time display */}
                  <motion.div 
                    className={`font-mono text-secondary/40 tracking-wider text-center ${
                      isMobile ? 'text-[10px] px-1.5 min-w-[70px]' : 'text-[10px] px-2 min-w-[60px]'
                    }`}
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </motion.div>
                  
                  {!isMobile && (
                    <motion.button
                      onClick={() => onSeek(Math.min(duration, currentTime + 5))}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/40 hover:text-secondary/60 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Seek forward 5 seconds"
                    >
                      <SkipForward className="w-3 h-3" />
                    </motion.button>
                  )}
                </div>

                {!isMobile && <div className="w-px h-6 bg-primary/10" />}

                {/* Utility controls */}
                <div className={`flex items-center gap-0.5 ${isMobile ? 'gap-0.5' : ''}`}>
                  {/* Settings Button */}
                  <motion.button
                    onClick={() => setIsSettingsOpen(true)}
                    className={`flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/30 hover:text-secondary/60 flex-shrink-0 ${
                      isMobile ? 'w-8 h-8' : 'w-8 h-8'
                    }`}
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    title="Settings (Ctrl+,)"
                    aria-label="Open settings"
                  >
                    <Settings className={`${isMobile ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
                  </motion.button>

                  {/* Metadata toggle - only on desktop */}
                  {!isMobile && (
                    <motion.button
                      onClick={onToggleMetadata}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/30 hover:text-secondary/60 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Toggle Metadata (H)"
                      aria-label="Toggle metadata"
                    >
                      <span className="text-[10px] tracking-wider">≡</span>
                    </motion.button>
                  )}
                  
                  {/* Fullscreen */}
                  <motion.button
                    onClick={onFullscreen}
                    className={`flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/30 hover:text-secondary/60 flex-shrink-0 ${
                      isMobile ? 'w-8 h-8' : 'w-8 h-8'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    title="Toggle Fullscreen (F)"
                    aria-label="Toggle fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize className={`${isMobile ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
                    ) : (
                      <Maximize className={`${isMobile ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
                    )}
                  </motion.button>

                  {/* Manual toggle button for PC */}
                  {!isMobile && (
                    <motion.button
                      onClick={toggleVisibility}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/30 hover:text-secondary/60 flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Hide Controls (Ctrl+H)"
                      aria-label="Hide controls"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>

                {!isMobile && (
                  <>
                    <div className="w-px h-6 bg-primary/10" />
                    
                    {/* Decorative dot */}
                    <motion.div 
                      className="w-1 h-1 rounded-full bg-accent/20"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </>
                )}
              </div>

              {/* Progress bar */}
              <motion.div 
                className={`absolute ${
                  isMobile ? '-bottom-1.5 left-2 right-2' : '-bottom-6 left-1/2 -translate-x-1/2 w-3/4'
                } h-px bg-primary/10 overflow-hidden rounded-full`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r from-accent/60 to-accent ${
                    isMobile ? 'h-1' : ''
                  }`}
                  style={{ 
                    width: `${(currentTime / duration) * 100}%`,
                    transition: 'width 0.1s linear'
                  }}
                />
              </motion.div>

              {/* Touch indicator on mobile */}
              {isMobile && (
                <motion.div 
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-[6px] text-secondary/15 tracking-wider whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  ← swipe to seek →
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut hint for PC */}
      {!isMobile && !isVisible && (
        <motion.div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 text-secondary/20 text-[10px] tracking-wider font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Press Ctrl+H to show controls
        </motion.div>
      )}

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default Controls;