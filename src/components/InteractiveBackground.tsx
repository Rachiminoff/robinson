import React from 'react';
import { motion } from 'framer-motion';
import { GeometryConfig } from '../types/composition';

interface InteractiveBackgroundProps {
  composition: GeometryConfig;
  isPlaying: boolean;
  currentTime: number;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ composition, currentTime }) => {
  const { colors } = composition;
  return (
    <motion.div
      className="fixed inset-0 z-0 overflow-hidden"
      animate={{ backgroundColor: colors.background }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.text} 1px, transparent 1px), linear-gradient(${colors.text} 1px, transparent 1px)`,
          backgroundSize: '8.3333% 12.5%',
        }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.018, 0.03, 0.018] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(circle at ${48 + Math.sin(currentTime / 11) * 3}% ${46 + Math.cos(currentTime / 13) * 3}%, ${colors.primary}18 0%, transparent 42%)`,
        }}
      />
    </motion.div>
  );
};

export default InteractiveBackground;
