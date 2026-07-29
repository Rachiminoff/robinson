import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 25); // 2.5 seconds total

    return () => clearInterval(interval);
  }, []);

  // Auto-complete after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          transition: { 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1] 
          }
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Background geometric patterns */}
          <motion.div 
            className="absolute inset-0 opacity-[0.03]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(45deg, currentColor 1px, transparent 1px),
                linear-gradient(-45deg, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: 'center'
            }} />
          </motion.div>

          {/* Animated diagonal lines */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              style={{ transform: 'rotate(-15deg)' }}
            />
            <motion.div 
              className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
              style={{ transform: 'rotate(15deg)' }}
            />
          </motion.div>

          {/* Main content container */}
          <div className="relative z-10 px-6 sm:px-12 md:px-16 py-8 sm:py-12 text-center max-w-[90vw] md:max-w-none">
            {/* Geometric frames - responsive */}
            <motion.div 
              className="absolute -inset-4 sm:-inset-6 md:-inset-8 border border-primary/10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div 
              className="absolute -inset-8 sm:-inset-12 md:-inset-16 border border-primary/5"
              initial={{ scale: 0.9, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 45 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div 
              className="absolute -inset-12 sm:-inset-18 md:-inset-24 border border-primary/3"
              initial={{ scale: 0.85, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Corner decorations - responsive */}
            <div className="absolute top-0 left-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t border-l border-primary/20" />
            <div className="absolute top-0 right-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t border-r border-primary/20" />
            <div className="absolute bottom-0 left-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b border-l border-primary/20" />
            <div className="absolute bottom-0 right-0 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b border-r border-primary/20" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Artist name */}
              <div className="text-secondary/60 text-[8px] sm:text-[10px] tracking-[0.3em] font-light uppercase mb-4 sm:mb-6 md:mb-8">
                <span className="inline-block">SPITZ</span>
                <span className="mx-2 opacity-30">•</span>
                <span className="opacity-50">1995</span>
              </div>

              {/* Main title - responsive text size */}
              <motion.h1 
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[-0.05em] text-primary leading-[1.1]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="relative inline-block">
                  ROBINSON
                  <motion.span 
                    className="absolute -inset-x-4 -inset-y-2 bg-accent/5 blur-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </span>
              </motion.h1>

              {/* Subtitle - responsive */}
              <motion.div 
                className="mt-3 sm:mt-4 text-secondary/40 text-[8px] sm:text-xs tracking-[0.2em] font-light uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Interactive Typography Experience
              </motion.div>

              {/* Decorative line */}
              <motion.div 
                className="w-8 sm:w-10 md:w-12 h-px bg-gradient-to-r from-accent/60 to-transparent mx-auto mt-4 sm:mt-5 md:mt-6"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />

              {/* Loading indicator with progress */}
              <motion.div 
                className="mt-4 sm:mt-5 md:mt-6 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-2 text-secondary/20 text-[7px] sm:text-[8px] tracking-[0.15em] font-light uppercase">
                  <motion.span 
                    className="inline-block w-1.5 h-1.5 rounded-full bg-accent/40"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span>LOADING</span>
                  <span className="font-mono text-[6px] sm:text-[7px] opacity-50">
                    {Math.min(100, progress)}%
                  </span>
                </div>

                {/* Progress bar - responsive */}
                <motion.div 
                  className="w-24 sm:w-32 md:w-40 h-px bg-primary/10 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent/60 to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Version info - responsive */}
          <motion.div 
            className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 text-secondary/10 text-[6px] sm:text-[7px] tracking-[0.2em] font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            v2.0.0
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(isMobile ? 8 : 16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-primary/10 rounded-full"
                initial={{
                  x: Math.random() * 100 - 50 + '%',
                  y: Math.random() * 100 - 50 + '%',
                  opacity: 0
                }}
                animate={{
                  x: [
                    Math.random() * 100 - 50 + '%',
                    Math.random() * 100 - 50 + '%',
                    Math.random() * 100 - 50 + '%'
                  ],
                  y: [
                    Math.random() * 100 - 50 + '%',
                    Math.random() * 100 - 50 + '%',
                    Math.random() * 100 - 50 + '%'
                  ],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;