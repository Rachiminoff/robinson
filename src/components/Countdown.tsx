import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  onComplete: () => void;
  duration?: number;
}

const Countdown: React.FC<CountdownProps> = ({ onComplete, duration = 5 }) => {
  const [count, setCount] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (count === 0) {
      setIsActive(false);
      setTimeout(onComplete, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Geometric frame */}
            <motion.div
              className="absolute -inset-12 border-2 border-accent/20 rotate-45"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className="absolute -inset-24 border border-primary/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
            
            {/* Glow orbs */}
            <motion.div
              className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl bg-accent/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl bg-blue-500/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/30" />

            {/* Countdown number */}
            <motion.div
              className="relative px-16 py-12 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                key={count}
                className="text-8xl md:text-9xl font-bold"
                style={{
                  fontFamily: "'Bungee', cursive",
                  background: 'linear-gradient(135deg, #E94560, #F1C40F, #3498DB)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 2s ease-in-out infinite'
                }}
                initial={{ scale: 1.5, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {count}
              </motion.div>

              <motion.div
                className="mt-4 text-secondary/40 text-xs tracking-[0.2em] font-light uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Starting in...
              </motion.div>

              {/* Decorative line */}
              <motion.div
                className="w-16 h-px mx-auto mt-4"
                style={{
                  background: 'linear-gradient(90deg, transparent, #E94560, transparent)'
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />

              {/* Pulsing dots */}
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-accent/40"
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Countdown;