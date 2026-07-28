import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.2, duration: 0.8 }}
      onAnimationComplete={onComplete}
    >
      <div className="relative">
        {/* Geometric frames with colors */}
        <motion.div 
          className="absolute -inset-8 border border-primary/10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.div 
          className="absolute -inset-16 border border-primary/5 rotate-45"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.div 
          className="absolute -inset-24 border border-accent/5 rotate-12"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
        
        {/* Diagonal lines */}
        <motion.div 
          className="absolute top-0 left-1/2 w-px h-full bg-primary/5 -rotate-45"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.div 
          className="absolute top-0 left-1/2 w-px h-full bg-primary/5 rotate-45"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Accent colored diagonal lines */}
        <motion.div 
          className="absolute top-0 right-1/4 w-px h-3/4 bg-accent/10 -rotate-30"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/4 w-px h-3/4 bg-accent/10 rotate-30"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        />
        
        {/* Glow orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl bg-accent/5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl bg-blue-500/5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
        
        {/* Content */}
        <div className="relative px-16 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Spitz - using Inter */}
            <motion.div 
              className="text-secondary/60 text-[10px] tracking-[0.3em] font-light uppercase mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ letterSpacing: '0.5em', opacity: 0 }}
              animate={{ letterSpacing: '0.3em', opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              SPITZ
            </motion.div>
            
            {/* Robinson - using Bungee with gradient */}
            <motion.div 
              className="text-7xl md:text-9xl tracking-[-0.05em]"
              style={{
                fontFamily: "'Bungee', cursive",
                background: 'linear-gradient(135deg, #E94560, #F1C40F, #3498DB, #9B59B6)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 4s ease-in-out infinite'
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              ROBINSON
            </motion.div>
            
            {/* Subtitle */}
            <motion.div 
              className="mt-4 text-secondary/40 text-xs tracking-[0.2em] font-light uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Interactive Typography Experience
            </motion.div>
            
            {/* Decorative line with color */}
            <motion.div 
              className="w-16 h-px mx-auto mt-6"
              style={{ 
                background: 'linear-gradient(90deg, transparent, #E94560, transparent)'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            
            {/* Loading with animated dots */}
            <motion.div 
              className="mt-6 text-secondary/20 text-[8px] tracking-[0.15em] font-light uppercase flex items-center justify-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              >
                ●
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              >
                ●
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
              >
                ●
              </motion.span>
              <span className="ml-2">LOADING</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Corner decorations with colors */}
        <motion.div 
          className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-accent/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-accent/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-accent/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-accent/30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        />
        
        {/* Inner corner decorations */}
        <motion.div 
          className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
        <motion.div 
          className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />
        <motion.div 
          className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        />
        <motion.div 
          className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;