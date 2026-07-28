import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BackgroundPulseProps {
  isPlaying: boolean;
  currentTime: number;
}

const BackgroundPulse: React.FC<BackgroundPulseProps> = ({ isPlaying, currentTime }) => {
  const [pulse, setPulse] = useState(0);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    // Simulate beat detection with time-based pulses
    // Assuming ~120 BPM = 2 beats per second
    const beatInterval = setInterval(() => {
      setPulse(prev => (prev + 1) % 2);
      setScale(1 + Math.random() * 0.002);
      
      setTimeout(() => setScale(1), 100);
    }, 500);
    
    return () => clearInterval(beatInterval);
  }, [isPlaying]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      animate={{
        scale: scale,
        opacity: isPlaying ? 1 : 0.5,
      }}
      transition={{ duration: 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5 opacity-30" />
      
      {/* Pulse rings */}
      {isPlaying && (
        <>
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-accent/5"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-accent/3"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.05, 0.2],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default BackgroundPulse;