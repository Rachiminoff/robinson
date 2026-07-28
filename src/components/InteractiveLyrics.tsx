import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ViewMode } from '../types';
import { lyricsData } from '../data/lyrics';
import { useMouseTracking } from '../hooks/useMouseTracking';

interface InteractiveLyricsProps {
  currentTime: number;
  viewMode: ViewMode;
}

const InteractiveLyrics: React.FC<InteractiveLyricsProps> = ({ currentTime, viewMode }) => {
  const mouse = useMouseTracking();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentLyric = useMemo(() => {
    for (let i = 0; i < lyricsData.length; i++) {
      const current = lyricsData[i];
      const next = lyricsData[i + 1];
      if (currentTime >= current.start && (next ? currentTime < next.start : true)) {
        return current;
      }
    }
    return lyricsData[0];
  }, [currentTime]);

  if (!currentLyric) return null;

  const showJapanese = viewMode === 'original' || viewMode === 'bilingual';
  const showEnglish = viewMode === 'translation' || viewMode === 'bilingual';

  // Calculate parallax offsets for text
  const textOffsetX = (mouse.normalizedX - 0.5) * 20;
  const textOffsetY = (mouse.normalizedY - 0.5) * 10;
  const rotation = (mouse.normalizedX - 0.5) * 2;

  const getScaleClasses = (scale?: string) => {
    switch (scale) {
      case 'small': return 'text-2xl md:text-3xl lg:text-4xl';
      case 'medium': return 'text-4xl md:text-6xl lg:text-7xl';
      case 'large': return 'text-5xl md:text-8xl lg:text-9xl';
      default: return 'text-4xl md:text-6xl lg:text-7xl';
    }
  };

  const japaneseScale = getScaleClasses(currentLyric.scale);
  const englishScale = getScaleClasses(currentLyric.scale === 'large' ? 'medium' : 'small');

  // Interactive text with mouse tracking
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none" ref={containerRef}>
      <div className="w-full h-full relative">
        {/* Background word with parallax */}
        {currentLyric.backgroundWord && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            animate={{
              x: textOffsetX * -0.5,
              y: textOffsetY * -0.5,
              opacity: 0.03,
            }}
            transition={{ type: "spring", damping: 20, stiffness: 50 }}
          >
            <span className="text-[40vw] font-black tracking-[-0.05em] whitespace-nowrap text-primary select-none">
              {currentLyric.backgroundWord}
            </span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`lyric-${currentLyric.start}-${viewMode}`}
            className="w-full h-full flex items-center justify-center px-8 md:px-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-full max-w-7xl"
              animate={{
                x: textOffsetX * 0.3,
                y: textOffsetY * 0.3,
                rotate: rotation * 0.1,
              }}
              transition={{ type: "spring", damping: 25, stiffness: 60 }}
            >
              <div className="flex flex-col items-center justify-center gap-8">
                {/* Japanese */}
                {showJapanese && (
                  <motion.div
                    className={`japanese-text font-light leading-[1.2] ${japaneseScale} text-primary tracking-tight`}
                    animate={{
                      x: textOffsetX * 0.5,
                      y: textOffsetY * 0.5,
                      letterSpacing: (mouse.normalizedX - 0.5) * 0.02 + 0.02,
                    }}
                    transition={{ type: "spring", damping: 20, stiffness: 40 }}
                  >
                    {currentLyric.japanese}
                  </motion.div>
                )}

                {/* English */}
                {showEnglish && currentLyric.english && (
                  <motion.div
                    className={`text-secondary font-light leading-[1.4] ${englishScale} tracking-[0.05em]`}
                    animate={{
                      x: textOffsetX * -0.3,
                      y: textOffsetY * -0.3,
                      opacity: 0.6 + (mouse.normalizedX - 0.5) * 0.3,
                    }}
                    transition={{ type: "spring", damping: 20, stiffness: 40 }}
                  >
                    {currentLyric.english}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveLyrics;