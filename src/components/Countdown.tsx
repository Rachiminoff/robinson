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
                className="text-8xl md:text-9xl font-bold text-accent"
                style={{
                  fontFamily: "'Bungee', cursive",
                }}
                initial={{ scale: 1.5, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {count}
              </motion.div>

              <motion.div
                className="mt-4 text-secondary/40 text-xs tracking-[0.2em] font-light uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Starting in...
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Countdown;