import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionOverlayProps {
  isActive: boolean;
  onComplete?: () => void;
}

const TransitionOverlay: React.FC<TransitionOverlayProps> = ({ isActive, onComplete }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Top curtain */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-background"
            initial={{ scaleY: 1, originY: 0 }}
            animate={{ scaleY: 0, originY: 0 }}
            exit={{ scaleY: 1, originY: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.1
            }}
            onAnimationComplete={onComplete}
          />
          
          {/* Bottom curtain */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-background"
            initial={{ scaleY: 1, originY: 1 }}
            animate={{ scaleY: 0, originY: 1 }}
            exit={{ scaleY: 1, originY: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1],
              delay: 0.1
            }}
          />
          
          {/* Center line glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-0 bg-accent/20"
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;