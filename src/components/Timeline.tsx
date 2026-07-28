import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { lyricsData } from '../data/lyrics';

interface TimelineProps {
  currentTime: number;
  duration: number;
}

const Timeline: React.FC<TimelineProps> = ({ currentTime, duration }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const [hovered, setHovered] = React.useState(false);
  const [hoverPosition, setHoverPosition] = React.useState(0);
  
  const currentSection = lyricsData.findIndex(
    (lyric, i) => {
      const next = lyricsData[i + 1];
      return currentTime >= lyric.start && (next ? currentTime < next.start : true);
    }
  );

  // Find the next lyric for preview
  const nextLyric = currentSection < lyricsData.length - 1 ? lyricsData[currentSection + 1] : null;
  const currentLyric = lyricsData[currentSection] || lyricsData[0];

  // Spring values for smooth animations
  const progressValue = useSpring(progress, { damping: 30, stiffness: 100 });
  
  useEffect(() => {
    progressValue.set(progress);
  }, [progress, progressValue]);

  return (
    <div className="fixed bottom-8 right-8 z-30 select-none">
      <div className="relative w-64">
        {/* Timeline bar */}
        <div className="relative h-1 bg-secondary/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full"
            style={{ width: progressValue }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Lyric markers */}
          <div className="absolute inset-0 flex items-center">
            {lyricsData.map((lyric, i) => {
              const pos = (lyric.start / duration) * 100;
              const isActive = i === currentSection;
              const isPast = i < currentSection;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    left: `${pos}%`,
                    background: isActive ? '#E94560' : isPast ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  }}
                  animate={{
                    scale: isActive ? 2 : 1,
                    height: isActive ? 4 : 2,
                  }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>
        </div>

        {/* Time display */}
        <div className="flex justify-between mt-2">
          <span className="text-secondary/30 text-[9px] tracking-[0.1em] font-light font-mono">
            {Math.floor(currentTime)}s
          </span>
          <span className="text-secondary/30 text-[9px] tracking-[0.1em] font-light font-mono">
            {Math.floor(duration)}s
          </span>
        </div>

        {/* Current lyric info */}
        <motion.div
          className="mt-2 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[8px] text-secondary/30 tracking-[0.15em] font-light uppercase">
            LINE {currentSection + 1} / {lyricsData.length}
          </div>
          {nextLyric && (
            <motion.div
              className="text-[7px] text-secondary/20 tracking-[0.1em] font-light mt-0.5"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              UP NEXT: {nextLyric.japanese}
            </motion.div>
          )}
        </motion.div>

        {/* Hover tooltip */}
        {hovered && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] text-secondary/40 tracking-[0.1em] font-light"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {Math.floor((hoverPosition / 100) * duration)}s
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Timeline;