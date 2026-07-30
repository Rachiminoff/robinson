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
  const [isInGap, setIsInGap] = useState<boolean>(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find current lyric - memoized with gap detection
  const currentLyric = useMemo(() => {
    // Define gap threshold (in seconds) - gaps longer than this will show nothing
    const GAP_THRESHOLD = 0.15;
    
    for (let i = 0; i < lyricsData.length; i++) {
      const lyric = lyricsData[i];
      const next = lyricsData[i + 1];
      
      // Check if current time is within this lyric's range
      if (currentTime >= lyric.start && currentTime < lyric.end) {
        setIsInGap(false);
        return { lyric, index: i };
      }
      
      // Check if we're in a gap between lyrics
      if (next && currentTime >= lyric.end && currentTime < next.start) {
        const gapDuration = next.start - lyric.end;
        // If gap is longer than threshold, show nothing (true gap)
        // If gap is very small, keep showing the previous lyric (for natural transitions)
        if (gapDuration > GAP_THRESHOLD) {
          setIsInGap(true);
          return null;
        } else {
          // Small gap - keep showing the previous lyric
          setIsInGap(false);
          return { lyric, index: i };
        }
      }
    }
    
    // Check if we're past the last lyric
    const lastLyric = lyricsData[lyricsData.length - 1];
    if (lastLyric && currentTime >= lastLyric.end) {
      setIsInGap(true);
      return null;
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

  // If no lyric or in a gap, show a blank/ambient state
  if (!currentLyric || !composition || !bgConfig || !compositionConfig || isInGap) {
    // Show just the background with ambient shapes
    return (
      <div className="fixed inset-0 z-10 overflow-hidden">
        {settings.showBackground && bgConfig && (
          <InteractiveBackground 
            composition={bgConfig}
            isPlaying={isPlaying}
            currentTime={currentTime}
          />
        )}
        {/* Subtle ambient indicator for gaps - optional */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <div className="text-secondary/10 text-[8px] tracking-[0.5em] uppercase font-light select-none">
            · · ·
          </div>
        </div>
      </div>
    );
  }

  const { lyric, index } = currentLyric;
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

  // Get mobile-optimized pattern (with variety)
  const getMobilePattern = (): CompositionPattern => {
    // Use the same pattern but with mobile-friendly adjustments
    // Some patterns work better on mobile than others
    const mobileFriendlyPatterns: CompositionPattern[] = [
      'oversized-japanese',
      'vertical-japanese-horizontal-english',
      'japanese-left-english-right',
      'opposite-corners',
      'japanese-fill-english-notes',
    ];
    
    // Cycle through mobile-friendly patterns
    const mobilePatternIndex = index % mobileFriendlyPatterns.length;
    return mobileFriendlyPatterns[mobilePatternIndex];
  };

  // Get mobile pattern
  const mobilePattern = isMobile ? getMobilePattern() : pattern;

  // Get scale based on pattern and emphasis (mobile optimized)
  const getJapaneseScale = () => {
    if (isMobile) {
      // Mobile-specific sizing - smaller but still readable
      if (mobilePattern === 'oversized-japanese' || mobilePattern === 'japanese-fill-english-notes') {
        return 'text-4xl sm:text-5xl';
      }
      if (mobilePattern === 'vertical-japanese-horizontal-english') {
        return 'text-3xl sm:text-4xl';
      }
      if (mobilePattern === 'japanese-left-english-right') {
        return 'text-3xl sm:text-4xl';
      }
      if (mobilePattern === 'opposite-corners') {
        return 'text-3xl sm:text-4xl';
      }
      return 'text-4xl sm:text-5xl';
    }
    
    // Desktop sizes
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
      // Mobile-specific English sizing
      if (mobilePattern === 'oversized-japanese' || mobilePattern === 'japanese-fill-english-notes') {
        return `text-xs sm:text-sm`;
      }
      if (mobilePattern === 'opposite-corners') return `text-sm sm:text-base`;
      if (mobilePattern === 'japanese-left-english-right') return `text-xs sm:text-sm`;
      if (mobilePattern === 'vertical-japanese-horizontal-english') return `text-xs sm:text-sm`;
      return `text-xs sm:text-sm`;
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

  // Get layout classes based on pattern (mobile optimized)
  const getPatternLayout = () => {
    if (isMobile) {
      // Mobile-specific layouts
      switch (mobilePattern) {
        case 'oversized-japanese':
          return 'flex flex-col items-center justify-center w-full relative px-4';
        case 'vertical-japanese-horizontal-english':
          return 'flex flex-col items-center justify-center w-full relative px-4';
        case 'japanese-left-english-right':
          return 'flex flex-col items-center justify-center w-full relative px-4';
        case 'opposite-corners':
          return 'flex flex-col items-center justify-center w-full relative px-4';
        case 'japanese-fill-english-notes':
          return 'flex flex-col items-center justify-center w-full relative px-4';
        default:
          return 'flex flex-col items-center justify-center w-full gap-4 px-4';
      }
    }
    
    // Desktop layouts
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

  // Get text positioning styles - Japanese (mobile optimized)
  const getJapanesePosition = (): React.CSSProperties => {
    if (isMobile) {
      // Mobile-specific positioning
      switch (mobilePattern) {
        case 'vertical-japanese-horizontal-english':
          return { 
            writingMode: 'vertical-rl' as const, 
            textOrientation: 'mixed' as const, 
            position: 'relative', 
            zIndex: 1,
            maxHeight: '80vh',
            fontSize: '1.8rem',
            lineHeight: 1.4,
          };
        case 'japanese-left-english-right':
          return { 
            textAlign: 'left' as const, 
            position: 'relative', 
            zIndex: 1,
            width: '100%',
            paddingRight: '1rem',
          };
        case 'opposite-corners':
          return { 
            position: 'relative' as const, 
            zIndex: 1,
            alignSelf: 'flex-start',
            marginBottom: '0.5rem',
          };
        case 'oversized-japanese':
          return { 
            position: 'relative', 
            zIndex: 1, 
            textAlign: 'center' as const,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            maxWidth: '100%',
            wordBreak: 'break-word',
          };
        case 'japanese-fill-english-notes':
          return { 
            position: 'relative', 
            zIndex: 1, 
            textAlign: 'center' as const,
            fontSize: '2rem',
            lineHeight: 1.3,
          };
        default:
          return { position: 'relative', zIndex: 1, textAlign: 'center' as const };
      }
    }
    
    // Desktop positioning
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

  // Get text positioning styles - English (mobile optimized)
  const getEnglishPosition = (): React.CSSProperties => {
    if (isMobile) {
      // Mobile-specific English positioning
      switch (mobilePattern) {
        case 'vertical-japanese-horizontal-english':
          return { 
            position: 'relative' as const, 
            zIndex: 2, 
            marginTop: '0.5rem',
            textAlign: 'center' as const,
            maxWidth: '90%',
            padding: '0.25rem 0.75rem',
          };
        case 'japanese-left-english-right':
          return { 
            position: 'relative' as const, 
            zIndex: 2, 
            marginTop: '0.25rem',
            textAlign: 'left' as const,
            paddingLeft: '0.5rem',
            borderLeft: '2px solid rgba(255,255,255,0.1)',
          };
        case 'opposite-corners':
          return { 
            position: 'relative' as const, 
            zIndex: 2,
            alignSelf: 'flex-end',
            marginTop: '0.5rem',
            textAlign: 'right' as const,
          };
        case 'oversized-japanese':
          return { 
            position: 'relative' as const, 
            zIndex: 2, 
            marginTop: '0.5rem',
            textAlign: 'center' as const,
            padding: '0.25rem 0.75rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
          };
        case 'japanese-fill-english-notes':
          return { 
            position: 'relative' as const, 
            zIndex: 2, 
            marginTop: '0.5rem',
            textAlign: 'center' as const,
            padding: '0.25rem 0.75rem',
            backgroundColor: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4px',
          };
        default:
          return { position: 'relative', zIndex: 2, marginTop: '0.5rem', textAlign: 'center' as const };
      }
    }
    
    // Desktop positioning
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
    
    // If animations are disabled, return simple fade
    if (!settings.enableAnimations) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }
    
    // Mobile gets simpler animations for performance
    if (isMobile) {
      return {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
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
    
    // On mobile, reduce effects for performance
    if (isMobile) {
      return {
        ...base,
        letterSpacing: isJapanese ? `0.${Math.round(letterSpacingValue * 4)}em` : `0.${Math.round(letterSpacingValue * 8)}em`,
        opacity: textOpacity,
        textShadow: '0 2px 20px rgba(0,0,0,0.3)',
      };
    }
    
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
        fontSize: isPrimary ? undefined : '0.8em',
        lineHeight: isMobile ? 1.4 : 1.1,
      };
    } else {
      return {
        fontSize: isPrimary ? (isMobile ? '0.85em' : '0.9em') : (isMobile ? '0.7em' : '0.7em'),
        textTransform: 'uppercase' as const,
        lineHeight: isMobile ? 1.4 : 1.3,
        letterSpacing: isMobile ? '0.04em' : '0.05em',
      };
    }
  };

  // Japanese character animation (mobile optimized)
  const renderJapaneseCharacters = () => {
    const chars = lyric.japanese.split('');
    const isAnimated = ['character-reveal', 'word-assembly', 'geometry-emerge'].includes(animation) && settings.enableAnimations && !isMobile;
    
    if (!isAnimated) {
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

  // English word animation (mobile optimized)
  const renderEnglishWords = () => {
    if (!lyric.english) return null;
    const words = lyric.english.split(' ');
    const isAnimated = ['word-stagger', 'word-assembly'].includes(animation) && settings.enableAnimations && !isMobile;
    
    if (!isAnimated) {
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
  const shouldBreathe = isPlaying && ['elegant', 'delicate'].includes(mood) && settings.enableBreathing && settings.enableAnimations && !isMobile;

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
        isMobile ? 'px-3 py-8' : 'px-8 md:px-16'
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
                className={`${japaneseSize} ${isMobile && mobilePattern === 'vertical-japanese-horizontal-english' ? 'writing-vertical' : pattern === 'vertical-japanese-horizontal-english' && !isMobile ? 'writing-vertical' : ''} relative`}
                style={{
                  ...japaneseStyle,
                  ...japaneseEffects,
                  ...japanesePos,
                  textShadow: getJapaneseTextShadow(),
                  ...(isMobile && mobilePattern === 'oversized-japanese' ? { fontSize: '2.5rem' } : {}),
                  ...(isMobile && mobilePattern === 'vertical-japanese-horizontal-english' ? { 
                    fontSize: '1.8rem', 
                    maxHeight: '80vh',
                    overflow: 'visible',
                  } : {}),
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
                {!isMobile && isPlaying && mood === 'dramatic' && settings.enableGlow && settings.enableAnimations && (
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
                className={`${englishSize} ${pattern === 'opposite-corners' && !isMobile ? 'text-right' : ''}`}
                style={{
                  ...englishStyle,
                  ...englishEffects,
                  ...englishPos,
                  opacity: englishOpacity * (settings.textOpacity / 100),
                  textShadow: getEnglishTextShadow(),
                  position: englishPos.position || 'relative',
                  zIndex: englishPos.zIndex || 2,
                  ...(isMobile && mobilePattern === 'opposite-corners' ? { 
                    alignSelf: 'flex-end',
                    marginTop: '0.5rem',
                  } : {}),
                  ...(isMobile && mobilePattern === 'japanese-left-english-right' ? {
                    paddingLeft: '0.5rem',
                    borderLeft: '2px solid rgba(255,255,255,0.1)',
                  } : {}),
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
                {!isMobile && isPlaying && mood === 'delicate' && settings.enableAnimations && (
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
      {settings.showMetadata && !isMobile && (
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
      {settings.enableAnimations && !isMobile && (
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
            writing-mode: vertical-rl;
            text-orientation: mixed;
            max-height: 80vh;
            font-size: 1.8rem;
            line-height: 1.4;
          }
          
          /* Ensure vertical text doesn't overflow */
          .writing-vertical span {
            display: block;
            padding: 0.1rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PosterComposition;