import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Share2, 
  Heart,
  Music,
} from 'lucide-react';

interface EndingScreenProps {
  isVisible: boolean;
  onPlayAgain: () => void;
  onRestart: () => void;
  onShare?: () => void;
  totalDuration: number;
  songTitle: string;
  artist: string;
}

const EndingScreen: React.FC<EndingScreenProps> = ({
  isVisible,
  onPlayAgain,
  onRestart,
  onShare,
  totalDuration,
  songTitle,
  artist,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; delay: number; duration: number }>>([]);

  // Generate floating particles
  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
      }));
      setParticles(newParticles);
      
      // Show content after a short delay
      const timer = setTimeout(() => setShowContent(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-accent/20"
              initial={{ 
                x: `${particle.x}%`, 
                y: `${particle.y}%`,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y - 40}%`],
                x: [`${particle.x}%`, `${particle.x + (Math.random() - 0.5) * 10}%`, `${particle.x + (Math.random() - 0.5) * 20}%`],
                scale: [0, 1, 0.5],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: particle.size,
                height: particle.size,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="relative max-w-2xl w-full mx-4 p-8 text-center"
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ 
            scale: showContent ? 1 : 0.9, 
            y: showContent ? 0 : 30, 
            opacity: showContent ? 1 : 0 
          }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-accent/5 animate-spin-slow" />
            <div className="absolute w-48 h-48 rounded-full border border-accent/5 animate-spin-slow-reverse" />
          </div>

          {/* Icon */}
          <motion.div
            className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-accent/10 border border-accent/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 100,
              delay: 0.5 
            }}
          >
            <Heart className="w-10 h-10 text-accent animate-pulse-slow" />
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-4xl font-light text-secondary tracking-wider mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-gradient-red">Thank You</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-secondary/40 text-sm tracking-[0.15em] font-light uppercase mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            You've experienced the journey
          </motion.p>

          {/* Song info */}
          <motion.div
            className="mb-8 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-secondary/60 text-sm font-light tracking-wide">
              <span className="text-secondary">{songTitle}</span>
            </p>
            <p className="text-secondary/30 text-[10px] tracking-[0.2em] font-light uppercase">
              {artist} · {formatDuration(totalDuration)}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Play Again - Primary */}
            <motion.button
              onClick={onPlayAgain}
              className="group relative px-8 py-3 bg-accent hover:bg-accent/80 text-white text-xs tracking-[0.15em] font-light uppercase rounded-full transition-all duration-300 flex items-center gap-2 overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Play Again
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/10 to-accent/0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            {/* Restart */}
            <motion.button
              onClick={onRestart}
              className="px-8 py-3 bg-primary/5 hover:bg-primary/10 border border-primary/10 text-secondary/60 hover:text-secondary/80 text-xs tracking-[0.15em] font-light uppercase rounded-full transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </motion.button>

            {/* Share (optional) */}
            {onShare && (
              <motion.button
                onClick={onShare}
                className="px-8 py-3 bg-primary/5 hover:bg-primary/10 border border-primary/10 text-secondary/40 hover:text-secondary/60 text-xs tracking-[0.15em] font-light uppercase rounded-full transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-8 text-[8px] text-secondary/20 tracking-[0.15em] font-light uppercase flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <span className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              {songTitle}
            </span>
            <span className="w-px h-2 bg-secondary/10" />
            <span>Made with ❤️</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EndingScreen;