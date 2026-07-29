import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useMouseTracking } from '../hooks/useMouseTracking';
import { useSettings } from '../context/SettingsContext';
import SongInfoModal from './SongInfoModal';
import metadataData from '../data/metadata.json';

interface MetadataProps {
  visible: boolean;
  currentTime: number;
  onExit?: () => void;
}

// Interface matching the exact JSON structure
interface SongMetadata {
  artist: string;
  artistCountry: string;
  title: string;
  year: number;
  trackNumber: string;
  duration: number;
  label: string;
  producers: string[];
  writers: string[];
  genres: string[];
  bpm: number;
  key: string;
  mood: string[];
  description: string;
  album: {
    title: string;
    releaseDate: string;
    trackNumber: number;
  };
  single: {
    releaseDate: string;
    catalogNumber: string;
    format: string;
  };
  charts: {
    oricon: {
      peak: number;
      weeksOnChart: number;
    };
  };
  sales: {
    copiesSold: number;
    certification: string;
  };
  credits: {
    lyrics: string;
    composition: string;
    arrangement: string[];
    producer: string[];
  };
}

// Use the data directly
const songData: SongMetadata = metadataData as SongMetadata;

const Metadata: React.FC<MetadataProps> = ({ visible, currentTime, onExit }) => {
  const { settings } = useSettings();
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouse = useMouseTracking();
  const [isHovered, setIsHovered] = useState(false);
  const [showExitButton, setShowExitButton] = useState(false);
  
  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Show exit button after a delay
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setShowExitButton(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowExitButton(false);
    }
  }, [visible]);

  // Keyboard shortcut for exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onExit) {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if metadata should be shown (from settings)
  const shouldShowMetadata = visible && settings.showMetadata;

  // Hide on mobile or when not visible or when settings say to hide
  if (!shouldShowMetadata || isMobile) return null;

  const offsetX = (mouse.normalizedX - 0.5) * 8;
  const offsetY = (mouse.normalizedY - 0.5) * 4;

  return (
    <>
      <motion.div
        className="fixed bottom-8 left-8 z-30 select-none"
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          x: offsetX,
          transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            x: { type: "spring", damping: 20, stiffness: 50 }
          }
        }}
        exit={{ opacity: 0, y: 20, x: -20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative"
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          {/* Glow - respect settings */}
          <motion.div
            className="absolute -inset-4 rounded-xl blur-xl"
            style={{
              background: settings.enableGlow ? `radial-gradient(circle, ${songData.artist === 'SPITZ' ? '#e94560' : '#6366f1'}15, transparent 70%)` : 'none',
            }}
            animate={{
              opacity: isHovered && settings.enableGlow ? 0.5 : settings.enableGlow ? 0.3 : 0,
              scale: isHovered && settings.enableGlow ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
          
          <div className="relative bg-background/30 backdrop-blur-sm border border-primary/5 rounded-lg px-4 py-3 overflow-hidden">
            {/* Animated background gradient - respect settings */}
            {settings.enableAnimations && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent"
                animate={{
                  x: isHovered ? '100%' : '-100%',
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
            )}
            
            <div className="relative space-y-2.5">
              {/* Decorative line */}
              <motion.div 
                className="w-8 h-px bg-gradient-to-r from-accent/60 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: settings.enableAnimations ? 1 : 0,
                  opacity: settings.enableAnimations ? 1 : 0 
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              {/* Artist */}
              <motion.div 
                className="text-secondary text-[10px] tracking-[0.25em] font-light uppercase flex items-center gap-2"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  opacity: settings.textOpacity / 100,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: settings.textOpacity / 100,
                  x: 0 
                }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span>{songData.artist}</span>
                {settings.enableAnimations && (
                  <motion.span 
                    className="w-1 h-1 rounded-full bg-accent/30"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span className="text-secondary/40 text-[8px] tracking-[0.2em]">{songData.artistCountry}</span>
              </motion.div>
              
              {/* Title */}
              <div className="flex items-center gap-3">
                <motion.div 
                  className="text-secondary text-[11px] tracking-[0.2em] font-light uppercase"
                  style={{ 
                    fontFamily: "'Bungee', cursive",
                    letterSpacing: `${settings.letterSpacing / 100}em`,
                    opacity: settings.textOpacity / 100,
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: settings.textOpacity / 100,
                    x: 0 
                  }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <span className="text-gradient-red">{songData.title}</span>
                </motion.div>
                
                <motion.button
                  onClick={() => setShowModal(true)}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-secondary/30 hover:text-secondary/50"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Info className="w-3 h-3" />
                </motion.button>
              </div>
              
              {/* Decorative line */}
              <motion.div 
                className="w-12 h-px bg-primary/10"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: settings.enableAnimations ? 1 : 0,
                }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              
              {/* Track info */}
              <motion.div 
                className="text-secondary/60 text-[9px] tracking-[0.15em] font-light uppercase flex items-center gap-3"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  opacity: settings.textOpacity / 100,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: settings.textOpacity / 100 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span>{songData.year}</span>
                <span className="w-px h-3 bg-secondary/20" />
                <span>TRACK {songData.trackNumber}</span>
                <span className="w-px h-3 bg-secondary/20" />
                <span className="text-primary/40 font-mono">
                  {formatTime(currentTime)}
                </span>
              </motion.div>
              
              {/* Playing indicator */}
              <motion.div 
                className="flex items-center gap-2.5 mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: settings.enableAnimations ? 1 : 0.5,
                }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-accent/60"
                      animate={settings.enableAnimations ? {
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1],
                      } : {
                        opacity: 0.6,
                        scale: 1,
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <motion.span 
                  className="text-secondary/40 text-[9px] tracking-[0.2em] font-light uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  animate={settings.enableAnimations ? {
                    opacity: [0.4, 0.8, 0.4],
                  } : {
                    opacity: 0.6,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  PLAYING
                </motion.span>
              </motion.div>
            </div>
          </div>
          
          {/* Corner decorations - respect settings */}
          {settings.enableGlow && (
            <>
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-accent/20" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-accent/20" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-accent/20" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-accent/20" />
            </>
          )}
          
          {/* Exit Button */}
          {showExitButton && onExit && (
            <AnimatePresence>
              <motion.button
                className="absolute -top-2 -right-2 w-6 h-6 bg-background/80 backdrop-blur-sm border border-primary/10 rounded-full flex items-center justify-center text-secondary/40 hover:text-secondary/80 hover:bg-primary/5 transition-colors"
                onClick={onExit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 100,
                  delay: 0.5 
                }}
              >
                <X className="w-3 h-3" />
              </motion.button>
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
      
      {/* Song Info Modal */}
      <SongInfoModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default Metadata;