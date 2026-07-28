import React, { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Grid,
  Layers,
  Maximize,
  Minimize,
} from 'lucide-react';
import { useMouseTracking } from '../hooks/useMouseTracking';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  duration: number;
  onFullscreen: () => void;
  onToggleGrid: () => void;
  onToggleMetadata: () => void;
  isFullscreen?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onSeek,
  currentTime,
  duration,
  onFullscreen,
  onToggleGrid,
  onToggleMetadata,
  isFullscreen = false,
}) => {
  const mouse = useMouseTracking();
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useSpring(0, { damping: 25, stiffness: 100 });
  const y = useSpring(0, { damping: 25, stiffness: 100 });

  React.useEffect(() => {
    const targetX = (mouse.normalizedX - 0.5) * 15;
    const targetY = (mouse.normalizedY - 0.5) * 5;
    x.set(targetX);
    y.set(targetY);
  }, [mouse.normalizedX, mouse.normalizedY, x, y]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 select-none"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        x: x.get(),
      }}
      transition={{ 
        duration: 0.8, 
        delay: 0.5, 
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        damping: 25,
        stiffness: 80
      }}
      style={{ x, y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Glow */}
        <motion.div 
          className="absolute -inset-4 bg-accent/5 rounded-full blur-xl"
          animate={{
            opacity: isHovered ? 0.5 : 0.2,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
        
        <div className="relative flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur-xl border border-primary/10 rounded-full shadow-2xl shadow-black/50">
          {/* Play/Pause */}
          <motion.button
            onClick={onTogglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/20 hover:bg-accent/30 transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: isPlaying ? '0 0 30px rgba(233,69,96,0.2)' : 'none',
            }}
            transition={{ duration: 0.3 }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-accent" />
            ) : (
              <Play className="w-4 h-4 text-accent ml-0.5" />
            )}
          </motion.button>

          <div className="w-px h-8 bg-primary/10" />

          {/* Seek buttons */}
          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => onSeek(Math.max(0, currentTime - 5))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/40 hover:text-secondary/60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipBack className="w-3.5 h-3.5" />
            </motion.button>
            
            <motion.div 
              className="px-2 text-[10px] font-mono text-secondary/40 tracking-wider min-w-[60px] text-center"
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
            
            <motion.button
              onClick={() => onSeek(Math.min(duration, currentTime + 5))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/40 hover:text-secondary/60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="w-px h-8 bg-primary/10" />

          {/* Utility controls */}
          <div className="flex items-center gap-0.5">
            {[
              { icon: Grid, onClick: onToggleGrid, label: 'Toggle Grid (G)' },
              { icon: Layers, onClick: onToggleMetadata, label: 'Toggle Metadata (H)' },
              { icon: isFullscreen ? Minimize : Maximize, onClick: onFullscreen, label: 'Toggle Fullscreen (F)' },
            ].map((item, i) => (
              <motion.button
                key={i}
                onClick={item.onClick}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/5 transition-colors text-secondary/30 hover:text-secondary/60"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
              >
                <item.icon className="w-3.5 h-3.5" />
              </motion.button>
            ))}
          </div>

          <div className="w-px h-8 bg-primary/10" />

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
        </div>

        {/* Progress bar */}
        <motion.div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-px bg-primary/10 overflow-hidden rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-accent/60 to-accent"
            style={{ 
              width: `${(currentTime / duration) * 100}%`,
              transition: 'width 0.1s linear'
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Controls;