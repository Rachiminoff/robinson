import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewMode } from '../types';
import { lyricsData } from '../data/lyrics';

interface LyricsStageProps {
  currentTime: number;
  viewMode: ViewMode;
}

// Color palette for accents
const accentColors = [
  '#E94560', '#3498DB', '#F1C40F', '#2ECC71', '#9B59B6', '#EC407A', '#E67E22', '#14B8A6'
];

const getRandomColor = (seed: number) => accentColors[seed % accentColors.length];

// Proper easing curves
const easing = [0.22, 1, 0.36, 1];
const smoothEasing = [0.4, 0, 0.2, 1];

// Dynamic position variations for each lyric
const getDynamicPosition = (index: number, total: number) => {
  const positions = [
    { x: 0, y: 0, rotate: 0, scale: 1 }, // center
    { x: -10, y: -5, rotate: -2, scale: 1.05 }, // slight left up
    { x: 10, y: 5, rotate: 2, scale: 0.95 }, // slight right down
    { x: -5, y: 10, rotate: 3, scale: 1.02 }, // left down
    { x: 5, y: -10, rotate: -3, scale: 0.98 }, // right up
    { x: -15, y: 0, rotate: -4, scale: 1.08 }, // far left
    { x: 15, y: 0, rotate: 4, scale: 0.92 }, // far right
    { x: 0, y: -15, rotate: 0, scale: 1.1 }, // top center
    { x: 0, y: 15, rotate: 0, scale: 0.9 }, // bottom center
  ];
  return positions[index % positions.length];
};

// Dynamic text alignment variations
const getTextAlignment = (index: number) => {
  const alignments = ['text-center', 'text-left', 'text-right', 'text-center', 'text-left'];
  return alignments[index % alignments.length];
};

// Dynamic container width variations
const getContainerWidth = (index: number) => {
  const widths = ['max-w-7xl', 'max-w-5xl', 'max-w-4xl', 'max-w-6xl', 'max-w-3xl'];
  return widths[index % widths.length];
};

const LyricsStage: React.FC<LyricsStageProps> = ({ currentTime, viewMode }) => {
  const [prevLyric, setPrevLyric] = useState<any>(null);
  const [nextLyric, setNextLyric] = useState<any>(null);
  const [randomOffset, setRandomOffset] = useState({ x: 0, y: 0 });

  const currentLyric = useMemo(() => {
    const firstLyric = lyricsData[0];
    if (currentTime < firstLyric.start) return null;

    for (let i = 0; i < lyricsData.length; i++) {
      const current = lyricsData[i];
      const next = lyricsData[i + 1];
      if (currentTime >= current.start && (next ? currentTime < next.start : true)) {
        if (next) setNextLyric(next);
        else setNextLyric(null);
        if (i > 0) setPrevLyric(lyricsData[i - 1]);
        else setPrevLyric(null);
        
        // Generate random offset for this lyric
        setRandomOffset({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20
        });
        return current;
      }
    }
    return lyricsData[0];
  }, [currentTime]);

  if (!currentLyric) return null;

  const showJapanese = viewMode === 'original' || viewMode === 'bilingual';
  const showEnglish = viewMode === 'translation' || viewMode === 'bilingual';

  const lyricIndex = lyricsData.indexOf(currentLyric);
  const accentColor = getRandomColor(lyricIndex);
  const progress = (currentTime - currentLyric.start) / (currentLyric.end - currentLyric.start || 1);
  const dynamicPos = getDynamicPosition(lyricIndex, lyricsData.length);
  const textAlign = getTextAlignment(lyricIndex);
  const containerWidth = getContainerWidth(lyricIndex);
  const isEven = lyricIndex % 2 === 0;

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

  // Japanese text with character stagger
  const renderJapaneseWithStagger = (text: string) => {
    const chars = text.split('');
    return chars.map((char: string, index: number) => {
      const delay = index * 0.04;
      const randomRotate = (Math.random() - 0.5) * 10;
      const randomY = Math.random() * 20;
      return (
        <motion.span
          key={index}
          className="inline-block"
          style={{
            color: index % 3 === 0 ? accentColor : '#F5F5F5',
            textShadow: index % 2 === 0 ? `0 0 30px ${accentColor}33` : 'none',
            fontFamily: "'Mochiy Pop P One', sans-serif",
          }}
          initial={{ opacity: 0, y: 40 + randomY, rotate: -8 + randomRotate, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            rotate: 0, 
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            delay: delay,
            ease: easing as any,
            type: "spring",
            damping: 12,
            stiffness: 80,
          }}
          exit={{ 
            opacity: 0, 
            y: -30 - randomY * 0.5, 
            rotate: 5 + randomRotate * 0.5, 
            scale: 0.9,
            transition: { duration: 0.5, ease: easing as any }
          }}
          whileHover={{
            scale: 1.3,
            color: accentColor,
            transition: { type: "spring", damping: 10, stiffness: 200 }
          }}
        >
          {char}
        </motion.span>
      );
    });
  };

  // English text with word stagger
  const renderEnglishWithStagger = (text: string) => {
    const words = text.split(' ');
    return words.map((word: string, index: number) => {
      const color = index % 2 === 0 ? accentColor : '#888888';
      const randomX = (Math.random() - 0.5) * 20;
      return (
        <motion.span
          key={index}
          className="inline-block mr-2"
          style={{
            color: color,
            textShadow: index % 2 === 0 ? `0 0 20px ${accentColor}22` : 'none',
            fontFamily: "'Bungee', cursive",
          }}
          initial={{ opacity: 0, x: -30 + randomX, scale: 0.9 }}
          animate={{ 
            opacity: 0.7, 
            x: 0, 
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.06 + 0.3,
            ease: easing as any,
            type: "spring",
            damping: 14,
            stiffness: 70,
          }}
          exit={{ 
            opacity: 0, 
            x: 30 + randomX * 0.5, 
            scale: 0.9,
            transition: { duration: 0.4, ease: easing as any }
          }}
          whileHover={{
            scale: 1.15,
            color: '#F5F5F5',
            transition: { type: "spring", damping: 10, stiffness: 200 }
          }}
        >
          {word}
        </motion.span>
      );
    });
  };

  // Dynamic layout based on lyric index
  const getDynamicLayout = () => {
    const layouts = [
      { justify: 'center', items: 'center', gap: 'gap-6' },
      { justify: 'start', items: 'start', gap: 'gap-8' },
      { justify: 'end', items: 'end', gap: 'gap-4' },
      { justify: 'center', items: 'start', gap: 'gap-8' },
      { justify: 'start', items: 'center', gap: 'gap-6' },
    ];
    return layouts[lyricIndex % layouts.length];
  };

  const layout = getDynamicLayout();

  // Render geometric decorations with enhanced animations
  const renderGeometricDecorations = () => {
    const decorCount = 3 + (lyricIndex % 4);
    return (
      <>
        {/* Diagonal line */}
        <motion.div
          className="absolute top-0 right-8 w-[1px] h-16 origin-top-right -rotate-45"
          style={{ background: accentColor }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ 
            opacity: 0.3, 
            scaleY: 1,
          }}
          transition={{ duration: 1.2, ease: smoothEasing as any, delay: 0.3 }}
          exit={{ 
            opacity: 0, 
            scaleY: 0,
            transition: { duration: 0.6, ease: easing as any }
          }}
        />
        
        {/* Corner brackets - dynamic position */}
        {lyricIndex % 2 === 0 ? (
          <>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: `${accentColor}44` }} />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: `${accentColor}44` }} />
          </>
        ) : (
          <>
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: `${accentColor}44` }} />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: `${accentColor}44` }} />
          </>
        )}
        
        {/* Horizontal rule - dynamic position */}
        <motion.div
          className={`absolute ${lyricIndex % 3 === 0 ? 'top-1/4' : lyricIndex % 3 === 1 ? 'bottom-1/4' : 'bottom-1/3'} left-0 right-0 border-t`}
          style={{ borderColor: `${accentColor}22` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: 1, 
            opacity: 1,
          }}
          transition={{ duration: 1.2, ease: smoothEasing as any, delay: 0.4 }}
          exit={{ 
            scaleX: 0, 
            opacity: 0,
            transition: { duration: 0.6, ease: easing as any }
          }}
        />
        
        {/* Geometric blocks - dynamic count and position */}
        {[...Array(decorCount)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute border ${i % 2 === 0 ? 'rotate-45' : 'rotate-12'}`}
            style={{
              borderColor: `${accentColor}${20 + i * 5}`,
              width: 8 + i * 4,
              height: 8 + i * 4,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 20}%`,
              opacity: 0.1 + i * 0.02,
            }}
            initial={{ opacity: 0, rotate: 0, scale: 0 }}
            animate={{ 
              opacity: 0.1 + i * 0.02, 
              rotate: i % 2 === 0 ? 45 : 12, 
              scale: 1,
            }}
            transition={{ duration: 1.5, ease: smoothEasing as any, delay: 0.3 + i * 0.1 }}
            exit={{ 
              opacity: 0, 
              rotate: 90, 
              scale: 0,
              transition: { duration: 0.6, ease: easing as any }
            }}
          />
        ))}
        
        {/* Small circles - dynamic position */}
        {[...Array(2 + lyricIndex % 3)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full border"
            style={{
              borderColor: `${accentColor}${30 + i * 10}`,
              width: 4 + i * 4,
              height: 4 + i * 4,
              top: `${20 + i * 25}%`,
              right: `${10 + i * 15}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.2 + i * 0.05, 
              scale: 1,
            }}
            transition={{ duration: 1.5, ease: smoothEasing as any, delay: 0.5 + i * 0.1 }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              transition: { duration: 0.5, ease: easing as any }
            }}
          />
        ))}
        
        {/* Glow orbs - dynamic position */}
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            background: `${accentColor}11`,
            width: 80 + lyricIndex * 10,
            height: 80 + lyricIndex * 10,
            bottom: `${10 + (lyricIndex % 5) * 8}%`,
            right: `${5 + (lyricIndex % 4) * 10}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
          }}
          transition={{ duration: 2, ease: smoothEasing as any }}
          exit={{ 
            opacity: 0, 
            scale: 0.5,
            transition: { duration: 0.8, ease: easing as any }
          }}
        />
        
        <motion.div
          className="absolute rounded-full blur-2xl"
          style={{
            background: `${accentColor}08`,
            width: 60 + lyricIndex * 8,
            height: 60 + lyricIndex * 8,
            top: `${5 + (lyricIndex % 3) * 12}%`,
            left: `${8 + (lyricIndex % 5) * 8}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.8, 
            scale: 1,
          }}
          transition={{ duration: 2.5, ease: smoothEasing as any, delay: 0.5 }}
          exit={{ 
            opacity: 0, 
            scale: 0.5,
            transition: { duration: 0.8, ease: easing as any }
          }}
        />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="w-full h-full relative overflow-hidden">
        {/* Background word with dynamic position */}
        {currentLyric.backgroundWord && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 0.04, 
              scale: 1,
              x: dynamicPos.x * 2,
              y: dynamicPos.y * 2,
              rotate: dynamicPos.rotate * 0.5,
            }}
            transition={{ duration: 2, ease: smoothEasing as any }}
            exit={{ 
              opacity: 0, 
              scale: 1.2,
              transition: { duration: 0.8, ease: easing as any }
            }}
          >
            <span 
              className="text-[40vw] tracking-[-0.05em] whitespace-nowrap select-none"
              style={{ 
                color: `${accentColor}11`,
                fontFamily: "'Bungee', cursive"
              }}
            >
              {currentLyric.backgroundWord}
            </span>
          </motion.div>
        )}

        {/* Geometric decorations */}
        {renderGeometricDecorations()}

        {/* Main lyric container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentLyric.start}-${viewMode}`}
            className="w-full h-full flex items-center justify-center px-8 md:px-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: dynamicPos.x,
              y: dynamicPos.y,
              rotate: dynamicPos.rotate * 0.3,
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              x: -dynamicPos.x,
              y: -dynamicPos.y,
              rotate: -dynamicPos.rotate * 0.3,
            }}
            transition={{ 
              duration: 0.8, 
              ease: smoothEasing as any,
            }}
          >
            <div className={`w-full ${containerWidth} relative`}>
              {/* Previous lyric fade indicator */}
              {prevLyric && (
                <motion.div
                  className={`absolute ${isEven ? '-top-16' : '-bottom-16'} left-1/2 -translate-x-1/2 text-secondary/10 text-sm tracking-wider font-light whitespace-nowrap`}
                  initial={{ opacity: 0, y: isEven ? 10 : -10 }}
                  animate={{ opacity: 0.2, y: 0 }}
                  exit={{ opacity: 0, y: isEven ? -10 : 10 }}
                  transition={{ duration: 0.6, ease: easing as any }}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {prevLyric.japanese}
                </motion.div>
              )}

              {/* Main content with dynamic alignment */}
              <motion.div
                className={`flex flex-col ${layout.justify} ${layout.items} ${layout.gap} w-full`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  x: randomOffset.x * 0.5,
                }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: smoothEasing as any,
                  delay: 0.1
                }}
              >
                {/* Japanese */}
                {showJapanese && (
                  <motion.div
                    className={`japanese-text leading-[1.2] ${japaneseScale} tracking-tight ${textAlign} w-full`}
                    style={{
                      fontFamily: "'Mochiy Pop P One', sans-serif",
                      fontWeight: '400'
                    }}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                    }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ 
                      duration: 0.7, 
                      ease: smoothEasing as any,
                      delay: 0.2
                    }}
                  >
                    {currentLyric.animation === 'characterStagger' ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {renderJapaneseWithStagger(currentLyric.japanese)}
                      </div>
                    ) : (
                      <span style={{ color: accentColor }}>
                        {currentLyric.japanese}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* English */}
                {showEnglish && currentLyric.english && (
                  <motion.div
                    className={`leading-[1.4] ${englishScale} tracking-[0.05em] ${textAlign} w-full`}
                    style={{
                      fontFamily: "'Bungee', cursive",
                      fontWeight: '400'
                    }}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                    }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.7, 
                      ease: smoothEasing as any,
                      delay: 0.4
                    }}
                  >
                    {currentLyric.animation === 'characterStagger' ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {renderEnglishWithStagger(currentLyric.english)}
                      </div>
                    ) : (
                      <span style={{ color: '#888888' }}>
                        {currentLyric.english}
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Progress indicator */}
              <motion.div
                className={`absolute ${isEven ? 'bottom-0' : 'top-0'} left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: Math.min(progress * 2, 1),
                  opacity: 0.5
                }}
                transition={{ duration: 0.3 }}
                style={{ width: '80%' }}
              />

              {/* Decorative divider - dynamic position */}
              <motion.div
                className={`absolute ${isEven ? '-bottom-8' : '-top-8'} left-1/2 -translate-x-1/2 flex items-center gap-3`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/10" />
                <motion.div
                  className="w-1.5 h-1.5 rotate-45 border border-accent/30"
                  animate={{ 
                    rotate: 45,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/10" />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress ring with dynamic size */}
        <motion.div
          className="absolute bottom-8 right-8 rounded-full border border-accent/10"
          style={{
            width: 30 + lyricIndex * 2,
            height: 30 + lyricIndex * 2,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 0.3, 
            scale: 1,
          }}
          transition={{ duration: 1, ease: smoothEasing as any, delay: 0.5 }}
        >
          <motion.div
            className={`absolute inset-1 rounded-full border-t border-accent/30`}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + lyricIndex % 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LyricsStage;