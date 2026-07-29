import React, { useMemo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { lyricsData } from '../data/lyrics';
import InteractiveBackground from './InteractiveBackground';
import { CompositionEngine } from '../engine/CompositionEngine';
import { GeometryConfig } from '../types/composition';
import { useSettings } from '../context/SettingsContext';

interface PosterCompositionProps {
  currentTime: number;
  viewMode: 'original' | 'bilingual' | 'translation';
  isPlaying: boolean;
}

// Editorial composition patterns
type CompositionPattern = 
  | 'oversized-japanese'
  | 'japanese-left-english-right'
  | 'vertical-japanese-horizontal-english'
  | 'overlapping-english'
  | 'cropped-japanese'
  | 'japanese-fill-english-notes'
  | 'opposite-corners'
  | 'geometric-placement'
  | 'rule-based'
  | 'wrapped-around-shapes';

// Animation styles
type AnimationStyle = 
  | 'character-reveal'
  | 'word-stagger'
  | 'vertical-wipe'
  | 'horizontal-mask'
  | 'clip-path'
  | 'blur-to-focus'
  | 'tracking-expand'
  | 'oversized-scale'
  | 'slide-grid'
  | 'cropped-reveal'
  | 'editorial-rotation'
  | 'word-assembly'
  | 'geometry-emerge'
  | 'rectangle-reveal'
  | 'background-fade';

// Mood types
type MoodType = 'minimal' | 'dramatic' | 'elegant' | 'bold' | 'delicate' | 'balanced';

interface CompositionConfig {
  pattern: CompositionPattern;
  animation: AnimationStyle;
  mood: MoodType;
  emphasis: 'japanese' | 'english' | 'balanced';
  layout: string;
  metadata: {
    position: string;
    opacity: number;
  };
}

const PosterComposition: React.FC<PosterCompositionProps> = ({ 
  currentTime, 
  viewMode,
  isPlaying 
}) => {
  const { settings, getFontFamily, getFontWeight } = useSettings();
  const [isMobile, setIsMobile] = useState(false);
  const [previousIndex, setPreviousIndex] = useState<number>(-1);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find current lyric - memoized
  const currentLyric = useMemo(() => {
    for (let i = 0; i < lyricsData.length; i++) {
      const lyric = lyricsData[i];
      const next = lyricsData[i + 1];
      if (currentTime >= lyric.start && (next ? currentTime < next.start : true)) {
        return { lyric, index: i };
      }
    }
    return null;
  }, [currentTime]);

  // Track index changes for animation decisions
  useEffect(() => {
    if (currentLyric && currentLyric.index !== previousIndex) {
      setPreviousIndex(currentLyric.index);
    }
  }, [currentLyric, previousIndex]);

  // Generate composition configuration based on lyric index
  const compositionConfig = useMemo((): CompositionConfig | null => {
    if (!currentLyric) return null;
    
    const { index } = currentLyric;
    // Remove unused total variable
    // const total = lyricsData.length;
    
    // Cycle through patterns to ensure variety
    const patterns: CompositionPattern[] = [
      'oversized-japanese',
      'japanese-left-english-right',
      'vertical-japanese-horizontal-english',
      'overlapping-english',
      'cropped-japanese',
      'japanese-fill-english-notes',
      'opposite-corners',
      'geometric-placement',
      'rule-based',
      'wrapped-around-shapes'
    ];
    
    const patternIndex = index % patterns.length;
    const pattern = patterns[patternIndex];
    
    // Determine animation style (avoid repeating same animation)
    const animations: AnimationStyle[] = [
      'character-reveal',
      'word-stagger',
      'vertical-wipe',
      'horizontal-mask',
      'clip-path',
      'blur-to-focus',
      'tracking-expand',
      'oversized-scale',
      'slide-grid',
      'cropped-reveal',
      'editorial-rotation',
      'word-assembly',
      'geometry-emerge',
      'rectangle-reveal',
      'background-fade'
    ];
    
    const animIndex = (index * 2 + Math.floor(index / 3)) % animations.length;
    const animation = animations[animIndex];
    
    // Determine mood based on lyric position and content
    const moods: MoodType[] = ['minimal', 'dramatic', 'elegant', 'bold', 'delicate', 'balanced'];
    const moodIndex = (index + Math.floor(index / 2)) % moods.length;
    const mood = moods[moodIndex];
    
    // Determine emphasis
    let emphasis: 'japanese' | 'english' | 'balanced' = 'japanese';
    if (index % 5 === 2) emphasis = 'english';
    else if (index % 5 === 4) emphasis = 'balanced';
    
    // Layout variations
    const layouts = ['split', 'diagonal', 'grid', 'frame', 'minimal', 'vertical', 'dense'];
    const layout = layouts[index % layouts.length];
    
    // Metadata positions
    const positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'corner'];
    const metadata = {
      position: positions[index % positions.length],
      opacity: 0.3 + (index % 3) * 0.1,
    };
    
    return { pattern, animation, mood, emphasis, layout, metadata };
  }, [currentLyric]);

  // Get composition data from engine
  const composition = useMemo(() => {
    if (!currentLyric || !compositionConfig) return null;
    
    const { lyric, index } = currentLyric;
    const context = {
      currentTime,
      lyricIndex: index,
      totalLyrics: lyricsData.length,
      isPlaying,
      progress: (currentTime - lyric.start) / (lyric.end - lyric.start || 1),
    };
    return CompositionEngine.generateComposition(lyric, index, lyricsData.length, context);
  }, [currentLyric, currentTime, isPlaying, compositionConfig]);

  // Get background geometry config
  const bgConfig = useMemo((): GeometryConfig | null => {
    if (!currentLyric || !compositionConfig) return null;
    
    const { lyric, index } = currentLyric;
    const context = {
      currentTime,
      lyricIndex: index,
      totalLyrics: lyricsData.length,
      isPlaying,
      progress: (currentTime - lyric.start) / (lyric.end - lyric.start || 1),
    };
    const comp = CompositionEngine.generateComposition(lyric, index, lyricsData.length, context);
    
    return {
      shapes: CompositionEngine.getShapesForLyric(lyric, index, context),
      colors: comp.colors,
    };
  }, [currentLyric, currentTime, isPlaying, compositionConfig]);

  // If no lyric, show nothing
  if (!currentLyric || !composition || !bgConfig || !compositionConfig) return null;

  const { lyric, index } = currentLyric;
  // Remove unused layout from destructuring
  const { pattern, animation, mood, emphasis, metadata } = compositionConfig;
  
  // Apply settings to determine what to show
  const shouldShowJapanese = settings.languagePreference === 'japanese' || settings.languagePreference === 'bilingual';
  const shouldShowEnglish = settings.languagePreference === 'english' || settings.languagePreference === 'bilingual';
  
  // Override with viewMode prop (for backward compatibility)
  const showJapanese = viewMode === 'original' || viewMode === 'bilingual';
  const showEnglish = viewMode === 'translation' || viewMode === 'bilingual';
  
  // Final decision: use settings if they conflict with viewMode
  const finalShowJapanese = showJapanese && shouldShowJapanese;
  const finalShowEnglish = showEnglish && shouldShowEnglish;

  // Get font family from settings
  const fontFamily = getFontFamily();
  const fontWeight = getFontWeight();
  // Remove unused fontSize - it's applied through the className system
  // const fontSizeClass = getFontSize();

  // Get scale based on pattern and emphasis
  const getJapaneseScale = () => {
    if (isMobile) {
      if (pattern === 'oversized-japanese' || pattern === 'japanese-fill-english-notes') {
        return 'text-5xl sm:text-6xl';
      }
      if (pattern === 'cropped-japanese') return 'text-6xl sm:text-7xl';
      if (pattern === 'vertical-japanese-horizontal-english') return 'text-3xl sm:text-4xl';
      return 'text-4xl sm:text-5xl';
    }
    
    if (pattern === 'oversized-japanese' || pattern === 'japanese-fill-english-notes') {
      return 'text-8xl md:text-9xl lg:text-[10rem]';
    }
    if (pattern === 'cropped-japanese') return 'text-[10rem] md:text-[12rem] lg:text-[16rem]';
    if (pattern === 'vertical-japanese-horizontal-english') return 'text-6xl md:text-7xl lg:text-8xl';
    if (pattern === 'japanese-left-english-right') return 'text-7xl md:text-8xl lg:text-9xl';
    return 'text-6xl md:text-7xl lg:text-8xl';
  };

  const getEnglishScale = () => {
    // Apply englishSize from settings
    const sizeMultiplier = settings.englishSize / 100;
    
    if (isMobile) {
      if (pattern === 'oversized-japanese' || pattern === 'japanese-fill-english-notes') {
        return `text-xs sm:text-sm`;
      }
      if (pattern === 'opposite-corners') return `text-lg sm:text-xl`;
      if (pattern === 'japanese-left-english-right') return `text-base sm:text-lg`;
      return `text-sm sm:text-base`;
    }
    
    let baseSize = '';
    if (pattern === 'oversized-japanese' || pattern === 'japanese-fill-english-notes') {
      baseSize = 'text-sm md:text-base lg:text-lg';
    } else if (pattern === 'opposite-corners') {
      baseSize = 'text-2xl md:text-3xl lg:text-4xl';
    } else if (pattern === 'japanese-left-english-right') {
      baseSize = 'text-xl md:text-2xl lg:text-3xl';
    } else if (pattern === 'overlapping-english') {
      baseSize = 'text-3xl md:text-4xl lg:text-5xl';
    } else {
      baseSize = 'text-base md:text-lg lg:text-xl';
    }
    
    // Apply size multiplier
    if (sizeMultiplier < 1) {
      // Reduce size
      const sizes: Record<string, string> = {
        'text-sm': 'text-xs',
        'text-base': 'text-sm',
        'text-lg': 'text-base',
        'text-xl': 'text-lg',
        'text-2xl': 'text-xl',
        'text-3xl': 'text-2xl',
        'text-4xl': 'text-3xl',
        'text-5xl': 'text-4xl',
      };
      return sizes[baseSize] || baseSize;
    }
    
    return baseSize;
  };

  const japaneseSize = getJapaneseScale();
  const englishSize = getEnglishScale();

  // Get layout classes based on pattern
  const getPatternLayout = () => {
    if (isMobile) {
      return 'flex flex-col items-center justify-center w-full gap-6';
    }
    
    switch (pattern) {
      case 'oversized-japanese':
        return 'flex flex-col items-center justify-center w-full relative';
      case 'japanese-left-english-right':
        return 'flex flex-row items-start justify-between w-full px-8 lg:px-16';
      case 'vertical-japanese-horizontal-english':
        return 'flex flex-row items-center justify-center w-full gap-12 lg:gap-24';
      case 'overlapping-english':
        return 'flex flex-col items-center justify-center w-full relative';
      case 'cropped-japanese':
        return 'flex flex-col items-center justify-center w-full relative overflow-visible';
      case 'japanese-fill-english-notes':
        return 'flex flex-col items-center justify-center w-full relative';
      case 'opposite-corners':
        return 'flex flex-row items-center justify-between w-full px-8 lg:px-16 relative';
      case 'geometric-placement':
        return 'flex flex-col items-center justify-center w-full relative';
      case 'rule-based':
        return 'flex flex-col items-start justify-center w-full px-8 lg:px-16';
      case 'wrapped-around-shapes':
        return 'flex flex-col items-center justify-center w-full relative';
      default:
        return 'flex flex-col items-center justify-center w-full';
    }
  };

  // Get text positioning styles - Japanese
  const getJapanesePosition = (): React.CSSProperties => {
    if (isMobile) return { position: 'relative', zIndex: 1 };
    
    switch (pattern) {
      case 'japanese-left-english-right':
        return { textAlign: 'left' as const, width: '60%', position: 'relative', zIndex: 1 };
      case 'vertical-japanese-horizontal-english':
        return { writingMode: 'vertical-rl' as const, textOrientation: 'mixed' as const, position: 'relative', zIndex: 1 };
      case 'opposite-corners':
        return { position: 'absolute' as const, top: '10%', left: '10%', zIndex: 1 };
      case 'cropped-japanese':
        return { 
          position: 'relative' as const,
          zIndex: 1,
          width: '100%',
          textAlign: 'center' as const,
        };
      case 'japanese-fill-english-notes':
        return { position: 'relative' as const, zIndex: 1, textAlign: 'center' as const };
      case 'overlapping-english':
        return { position: 'relative' as const, zIndex: 2 };
      case 'geometric-placement':
        return { position: 'absolute' as const, top: '20%', left: '15%', zIndex: 1 };
      case 'rule-based':
        return { paddingLeft: '2rem', position: 'relative', zIndex: 1 };
      case 'wrapped-around-shapes':
        return { position: 'relative' as const, zIndex: 1, textAlign: 'center' as const };
      default:
        return { position: 'relative', zIndex: 1 };
    }
  };

  // Get text positioning styles - English
  const getEnglishPosition = (): React.CSSProperties => {
    if (isMobile) return { position: 'relative', zIndex: 2, marginTop: '0.5rem' };
    
    switch (pattern) {
      case 'japanese-left-english-right':
        return { textAlign: 'right' as const, width: '35%', paddingTop: '1rem', position: 'relative', zIndex: 2 };
      case 'vertical-japanese-horizontal-english':
        return { maxWidth: '40%', position: 'relative', zIndex: 2 };
      case 'opposite-corners':
        return { position: 'absolute' as const, bottom: '15%', right: '10%', zIndex: 2 };
      case 'cropped-japanese':
        return { 
          position: 'relative' as const, 
          zIndex: 2, 
          marginTop: '2rem',
          textAlign: 'center' as const,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '1rem 2rem',
          backdropFilter: 'blur(8px)',
          borderRadius: '4px',
        };
      case 'japanese-fill-english-notes':
        return { 
          position: 'relative' as const, 
          zIndex: 2, 
          marginTop: '1rem',
          textAlign: 'center' as const,
          padding: '0.5rem 1.5rem',
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(4px)',
          borderRadius: '4px',
        };
      case 'overlapping-english':
        return { 
          position: 'relative' as const, 
          zIndex: 2, 
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(4px)',
          borderRadius: '4px',
        };
      case 'geometric-placement':
        return { 
          position: 'absolute' as const, 
          bottom: '25%', 
          right: '15%', 
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '0.5rem 1.5rem',
          backdropFilter: 'blur(4px)',
          borderRadius: '4px',
        };
      case 'rule-based':
        return { 
          paddingLeft: '2rem', 
          borderLeft: '2px solid currentColor',
          position: 'relative',
          zIndex: 2,
          marginTop: '0.5rem',
        };
      case 'wrapped-around-shapes':
        return { 
          position: 'relative' as const, 
          zIndex: 2, 
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: 'rgba(0,0,0,0.15)',
          backdropFilter: 'blur(4px)',
          borderRadius: '4px',
        };
      default:
        return { position: 'relative', zIndex: 2, marginTop: '0.5rem' };
    }
  };

  // Animation variants based on style
  const getAnimationVariants = (type: 'japanese' | 'english') => {
    const isJapanese = type === 'japanese';
    // Remove unused progress variable
    // const progress = (currentTime - lyric.start) / (lyric.end - lyric.start || 1);
    
    // If animations are disabled, return simple fade
    if (!settings.enableAnimations) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
    
    switch (animation) {
      case 'character-reveal':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      
      case 'word-stagger':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };
      
      case 'vertical-wipe':
        return {
          initial: { clipPath: 'inset(100% 0 0 0)' },
          animate: { clipPath: 'inset(0% 0 0 0)' },
          exit: { clipPath: 'inset(100% 0 0 0)' },
        };
      
      case 'horizontal-mask':
        return {
          initial: { clipPath: 'inset(0 100% 0 0)' },
          animate: { clipPath: 'inset(0 0% 0 0)' },
          exit: { clipPath: 'inset(0 100% 0 0)' },
        };
      
      case 'clip-path':
        return {
          initial: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
          animate: { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
          exit: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
        };
      
      case 'blur-to-focus':
        return {
          initial: { opacity: 0, filter: 'blur(12px)', scale: 1.05 },
          animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
          exit: { opacity: 0, filter: 'blur(12px)', scale: 0.95 },
        };
      
      case 'tracking-expand':
        return {
          initial: { letterSpacing: '0.5em', opacity: 0 },
          animate: { letterSpacing: '0.02em', opacity: 1 },
          exit: { letterSpacing: '0.5em', opacity: 0 },
        };
      
      case 'oversized-scale':
        return {
          initial: { scale: 1.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.5, opacity: 0 },
        };
      
      case 'slide-grid':
        return {
          initial: { x: isJapanese ? -50 : 50, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: isJapanese ? 50 : -50, opacity: 0 },
        };
      
      case 'cropped-reveal':
        return {
          initial: { clipPath: 'inset(0 50% 0 50%)', opacity: 0 },
          animate: { clipPath: 'inset(0 0% 0 0%)', opacity: 1 },
          exit: { clipPath: 'inset(0 50% 0 50%)', opacity: 0 },
        };
      
      case 'editorial-rotation':
        return {
          initial: { rotate: -2, opacity: 0 },
          animate: { rotate: 0, opacity: 1 },
          exit: { rotate: 2, opacity: 0 },
        };
      
      case 'word-assembly':
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -30 },
        };
      
      case 'geometry-emerge':
        return {
          initial: { clipPath: 'circle(0% at 50% 50%)' },
          animate: { clipPath: 'circle(100% at 50% 50%)' },
          exit: { clipPath: 'circle(0% at 50% 50%)' },
        };
      
      case 'rectangle-reveal':
        return {
          initial: { clipPath: 'inset(0 0 100% 0)' },
          animate: { clipPath: 'inset(0 0 0% 0)' },
          exit: { clipPath: 'inset(0 0 100% 0)' },
        };
      
      case 'background-fade':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
        };
      
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
        };
    }
  };

  // Get typography effects
  const getTypographyEffects = (type: 'japanese' | 'english') => {
    const color = type === 'japanese' ? composition.colors.primary : composition.colors.secondary;
    const isJapanese = type === 'japanese';
    
    // Apply font style from settings
    const fontStyleMap: Record<string, any> = {
      elegant: { fontStyle: 'italic' },
      bold: { fontWeight: 700 },
      delicate: { fontWeight: 300, opacity: 0.9 },
      dramatic: { fontStyle: 'italic', fontWeight: 700 },
      minimal: { fontWeight: 400 },
    };
    
    const selectedFontStyle = fontStyleMap[settings.fontStyle] || {};
    
    // Base styles with font from settings
    const base = {
      color,
      fontFamily: fontFamily,
      fontWeight: isJapanese ? fontWeight : fontWeight - 100,
      transition: 'all 0.3s ease',
      ...selectedFontStyle,
    };
    
    // Apply letter spacing from settings
    const letterSpacingValue = settings.letterSpacing / 100;
    
    // Apply text opacity from settings
    const textOpacity = settings.textOpacity / 100;
    
    // Mood-based effects (with settings overrides)
    if (mood === 'dramatic' && settings.enableGlow) {
      return {
        ...base,
        textShadow: `0 0 40px ${color}33, 0 0 80px ${color}11`,
        letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 8)}em` : `0.${Math.round(letterSpacingValue * 15)}em`,
        opacity: textOpacity,
      };
    }
    
    if (mood === 'elegant' && settings.enableGlow) {
      return {
        ...base,
        textShadow: `0 2px 20px rgba(0,0,0,0.1)`,
        letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 5)}em` : `0.${Math.round(letterSpacingValue * 10)}em`,
        opacity: textOpacity,
      };
    }
    
    if (mood === 'bold') {
      return {
        ...base,
        textShadow: settings.enableGlow ? `0 4px 30px rgba(0,0,0,0.2)` : 'none',
        letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 2)}em` : `0.${Math.round(letterSpacingValue * 6)}em`,
        opacity: textOpacity,
      };
    }
    
    if (mood === 'delicate') {
      return {
        ...base,
        textShadow: settings.enableGlow ? `0 1px 10px rgba(0,0,0,0.05)` : 'none',
        letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 15)}em` : `0.${Math.round(letterSpacingValue * 20)}em`,
        opacity: textOpacity * 0.9,
      };
    }
    
    if (mood === 'minimal') {
      return {
        ...base,
        textShadow: 'none',
        letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 2)}em` : `0.${Math.round(letterSpacingValue * 4)}em`,
        opacity: textOpacity,
      };
    }
    
    // Balanced
    return {
      ...base,
      textShadow: settings.enableGlow ? `0 0 20px ${color}11` : 'none',
      letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 4)}em` : `0.${Math.round(letterSpacingValue * 8)}em`,
      opacity: textOpacity,
    };
  };

  // Get text style based on type and emphasis
  const getTextStyle = (type: 'japanese' | 'english') => {
    const isJapanese = type === 'japanese';
    const isPrimary = emphasis === 'japanese' ? isJapanese : !isJapanese;
    
    if (isJapanese) {
      return {
        ...(isPrimary ? {} : {}),
        fontSize: isPrimary ? undefined : '0.8em',
        lineHeight: 1.1,
      };
    } else {
      return {
        ...(isPrimary ? {} : {}),
        fontSize: isPrimary ? '0.9em' : '0.7em',
        textTransform: 'uppercase' as const,
        lineHeight: 1.3,
        letterSpacing: '0.05em',
      };
    }
  };

  // Japanese character animation
  const renderJapaneseCharacters = () => {
    const chars = lyric.japanese.split('');
    const isAnimated = ['character-reveal', 'word-assembly', 'geometry-emerge'].includes(animation) && settings.enableAnimations;
    
    if (!isAnimated || isMobile) {
      return lyric.japanese;
    }
    
    return chars.map((char, i) => (
      <motion.span
        key={i}
        className="inline-block"
        initial={{ opacity: 0, y: 10, rotate: 2 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          rotate: 0,
          transition: { 
            duration: 0.4, 
            delay: i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -10, 
          rotate: -2,
          transition: { duration: 0.2, delay: i * 0.02 }
        }}
      >
        {char}
      </motion.span>
    ));
  };

  // English word animation
  const renderEnglishWords = () => {
    if (!lyric.english) return null;
    const words = lyric.english.split(' ');
    const isAnimated = ['word-stagger', 'word-assembly'].includes(animation) && settings.enableAnimations;
    
    if (!isAnimated || isMobile) {
      return lyric.english;
    }
    
    return words.map((word, i) => (
      <motion.span
        key={i}
        className="inline-block mx-1"
        initial={{ opacity: 0, y: 15, filter: 'blur(2px)' }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)',
          transition: { 
            duration: 0.5, 
            delay: i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -15, 
          filter: 'blur(2px)',
          transition: { duration: 0.2, delay: i * 0.03 }
        }}
      >
        {word}
      </motion.span>
    ));
  };

  // Get Japanese and English positions
  const japanesePos = getJapanesePosition();
  const englishPos = getEnglishPosition();
  const patternLayout = getPatternLayout();

  // Get Japanese and English effects
  const japaneseEffects = getTypographyEffects('japanese');
  const englishEffects = getTypographyEffects('english');
  const japaneseStyle = getTextStyle('japanese');
  const englishStyle = getTextStyle('english');

  // Get animation variants
  const japaneseVariants = getAnimationVariants('japanese');
  const englishVariants = getAnimationVariants('english');

  // Determine if content should breathe (respect settings)
  const shouldBreathe = isPlaying && ['elegant', 'delicate'].includes(mood) && settings.enableBreathing && settings.enableAnimations;

  // Safely get text shadow
  const getJapaneseTextShadow = () => {
    if (isMobile) return '0 2px 20px rgba(0,0,0,0.3)';
    return (japaneseEffects as any).textShadow || 'none';
  };

  const getEnglishTextShadow = () => {
    if (isMobile) return '0 1px 10px rgba(0,0,0,0.2)';
    return (englishEffects as any).textShadow || 'none';
  };

  // English visibility - always ensure it's readable
  const englishOpacity = emphasis === 'english' ? 0.92 : 0.75;

  return (
    <div 
      className="fixed inset-0 z-10 overflow-hidden"
      // Remove unused onMouseEnter/onMouseLeave
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background - respect showBackground setting */}
      {settings.showBackground && (
        <InteractiveBackground 
          composition={bgConfig}
          isPlaying={isPlaying}
          currentTime={currentTime}
        />
      )}
      
      {/* Content Layer */}
      <div className={`absolute inset-0 flex items-center justify-center z-10 ${
        isMobile ? 'px-4 py-16' : 'px-8 md:px-16'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`composition-${index}`}
            className={`w-full ${isMobile ? 'max-w-full' : 'max-w-7xl'} ${patternLayout} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: settings.enableAnimations ? 0.4 : 0.1,
              ease: [0.22, 1, 0.36, 1] 
            }}
          >
            {/* Japanese - Primary text */}
            {finalShowJapanese && (
              <motion.div
                className={`${japaneseSize} ${pattern === 'vertical-japanese-horizontal-english' ? 'writing-vertical' : ''} relative`}
                style={{
                  ...japaneseStyle,
                  ...japaneseEffects,
                  ...japanesePos,
                  textShadow: getJapaneseTextShadow(),
                }}
                variants={japaneseVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ 
                  duration: settings.enableAnimations ? 0.6 : 0.1, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                {renderJapaneseCharacters()}
                
                {/* Breathing effect */}
                {shouldBreathe && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                
                {/* Glow underline for dramatic moments - respect glow setting */}
                {isPlaying && mood === 'dramatic' && settings.enableGlow && settings.enableAnimations && (
                  <motion.div
                    className="absolute -bottom-4 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current/40 to-transparent"
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* English - Annotation text - always visible with proper z-index */}
            {finalShowEnglish && lyric.english && (
              <motion.div
                className={`${englishSize} ${pattern === 'opposite-corners' ? 'text-right' : ''}`}
                style={{
                  ...englishStyle,
                  ...englishEffects,
                  ...englishPos,
                  opacity: englishOpacity * (settings.textOpacity / 100),
                  textShadow: getEnglishTextShadow(),
                  position: englishPos.position || 'relative',
                  zIndex: englishPos.zIndex || 2,
                }}
                variants={englishVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ 
                  duration: settings.enableAnimations ? 0.6 : 0.1, 
                  delay: settings.enableAnimations ? 0.1 : 0,
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                {renderEnglishWords()}
                
                {/* Shimmer effect for delicate mood - respect animations */}
                {isPlaying && mood === 'delicate' && settings.enableAnimations && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Metadata - Editorial style - respect showMetadata setting */}
      {settings.showMetadata && (
        <div 
          className={`absolute ${metadata.position === 'bottom-left' ? 'bottom-6 left-6' : 
            metadata.position === 'bottom-right' ? 'bottom-6 right-6' :
            metadata.position === 'top-left' ? 'top-6 left-6' :
            metadata.position === 'top-right' ? 'top-6 right-6' :
            'bottom-6 left-6'} z-20 select-none`}
          style={{ opacity: metadata.opacity * (settings.textOpacity / 100) }}
        >
          <div className={`${isMobile ? 'bg-background/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/5' : ''}`}>
            <div className="space-y-0.5">
              <div className={`${isMobile ? 'text-[7px]' : 'text-[8px]'} tracking-[0.25em] uppercase text-secondary/40 font-light`}>
                SPITZ — ROBINSON
              </div>
              <div className={`flex items-center gap-1.5 md:gap-2 ${
                isMobile ? 'text-[6px]' : 'text-[7px]'
              } text-secondary/30 tracking-[0.15em] font-light flex-wrap`}>
                <span>1995</span>
                <span className="w-px h-2 bg-secondary/20" />
                <span>TRACK 03</span>
                <span className="w-px h-2 bg-secondary/20" />
                <span className="font-mono">03:21</span>
                <span className="w-px h-2 bg-secondary/20" />
                <span>LINE {index + 1}/{lyricsData.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Minimal progress indicator - respect animations */}
      {settings.enableAnimations && (
        <div
          className="absolute rounded-full border z-20"
          style={{
            width: isMobile ? 12 + index * 0.8 : 16 + index * 1.2,
            height: isMobile ? 12 + index * 0.8 : 16 + index * 1.2,
            borderColor: `${composition.colors.primary}15`,
            opacity: isMobile ? 0.15 : 0.2,
            bottom: isMobile ? 12 : 24,
            right: isMobile ? 12 : 24,
          }}
        >
          <div
            className="absolute inset-0.5 rounded-full border-t"
            style={{ 
              borderColor: `${composition.colors.primary}33`,
              animation: `rotateSlow ${6 + index % 4}s linear infinite`
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        
        @media (max-width: 768px) {
          .writing-vertical {
            writing-mode: horizontal-tb;
          }
        }
      `}</style>
    </div>
  );
};

export default PosterComposition;