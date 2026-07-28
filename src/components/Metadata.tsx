import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { useMouseTracking } from '../hooks/useMouseTracking';
import SongInfoModal from './SongInfoModal';

interface MetadataProps {
  visible: boolean;
  currentTime: number;
}

const Metadata: React.FC<MetadataProps> = ({ visible, currentTime }) => {
  const [showModal, setShowModal] = useState(false);
  const mouse = useMouseTracking();
  const [isHovered, setIsHovered] = useState(false);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

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
          {/* Glow */}
          <motion.div
            className="absolute -inset-4 bg-accent/5 rounded-xl blur-xl"
            animate={{
              opacity: isHovered ? 0.5 : 0.3,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
          
          <div className="relative bg-background/30 backdrop-blur-sm border border-primary/5 rounded-lg px-4 py-3 overflow-hidden">
            {/* Animated background gradient */}
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
            
            <div className="relative space-y-2.5">
              {/* Decorative line */}
              <motion.div 
                className="w-8 h-px bg-gradient-to-r from-accent/60 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              
              {/* Artist */}
              <motion.div 
                className="text-secondary text-[10px] tracking-[0.25em] font-light uppercase flex items-center gap-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span>SPITZ</span>
                <motion.span 
                  className="w-1 h-1 rounded-full bg-accent/30"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-secondary/40 text-[8px] tracking-[0.2em]">JPN</span>
              </motion.div>
              
              {/* Title */}
              <div className="flex items-center gap-3">
                <motion.div 
                  className="text-secondary text-[11px] tracking-[0.2em] font-light uppercase"
                  style={{ fontFamily: "'Bungee', cursive" }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <span className="text-gradient-red">ROBINSON</span>
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
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              
              {/* Track info */}
              <motion.div 
                className="text-secondary/60 text-[9px] tracking-[0.15em] font-light uppercase flex items-center gap-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  1995
                </motion.span>
                <motion.span 
                  className="w-px h-3 bg-secondary/20"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>TRACK 03</span>
                <motion.span 
                  className="w-px h-3 bg-secondary/20"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.span 
                  className="text-primary/40 font-mono"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  {formatTime(currentTime)}
                </motion.span>
              </motion.div>
              
              {/* Playing indicator */}
              <motion.div 
                className="flex items-center gap-2.5 mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-accent/60"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1],
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
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
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
          
          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-accent/20" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-accent/20" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-accent/20" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-accent/20" />
        </motion.div>
      </motion.div>
      
      <SongInfoModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Metadata;