import React, { useMemo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { lyricsData } from '../data/lyrics';
import InteractiveBackground from './InteractiveBackground';
import { CompositionEngine } from '../engine/CompositionEngine';
import { GeometryConfig } from '../types/composition';
import { useSettings } from '../context/SettingsContext';
import { seededRandom, randomItem } from '../utils/seededRandom';
import SwissPosterArt from './SwissPosterArt';

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
type VisualFamily =
  | 'swiss-grid'
  | 'bauhaus-orbit'
  | 'typographic-monument'
  | 'cropped-poster'
  | 'modular-blocks'
  | 'kinetic-rules'
  | 'vertical-editorial'
  | 'negative-space';

interface LyricProfile {
  japaneseLength: number;
  englishLength: number;
  englishWords: number;
  duration: number;
  density: number;
  intensity: number;
  repetition: number;
  hasPunctuation: boolean;
  hasQuestion: boolean;
  isShort: boolean;
  isLong: boolean;
  isQuiet: boolean;
  isDramatic: boolean;
}

interface CompositionConfig {
  pattern: CompositionPattern;
  animation: AnimationStyle;
  mood: MoodType;
  emphasis: 'japanese' | 'english' | 'balanced';
  layout: string;
  family: VisualFamily;
  variant: number;
  profile: LyricProfile;
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

  // Find current lyric - memoized with gap detection
  const currentLyric = useMemo(() => {
    const GAP_THRESHOLD = 0.15;
    for (let i = 0; i < lyricsData.length; i++) {
      const lyric = lyricsData[i];
      const next = lyricsData[i + 1];
      if (currentTime >= lyric.start && currentTime < lyric.end) return { lyric, index: i };
      if (next && currentTime >= lyric.end && currentTime < next.start) {
        return next.start - lyric.end <= GAP_THRESHOLD ? { lyric, index: i } : null;
      }
    }
    return null;
  }, [currentTime]);

  const isInGap = useMemo(() => {
    if (currentLyric) return false;
    const first = lyricsData[0];
    const last = lyricsData[lyricsData.length - 1];
    if (!first || !last) return false;
    return currentTime >= first.start && currentTime < last.end;
  }, [currentTime, currentLyric]);

  // Track index changes for animation decisions
  useEffect(() => {
    if (currentLyric && currentLyric.index !== previousIndex) {
      setPreviousIndex(currentLyric.index);
    }
  }, [currentLyric, previousIndex]);

  // Generate a seeded visual system for this loop.
  // Desktop and mobile deliberately use different visual vocabularies and seed
  // spaces, so the same lyric becomes a different poster on each device.
  const compositionConfig = useMemo((): CompositionConfig | null => {
    if (!currentLyric) return null;
    const { lyric } = currentLyric;
    const duration = Math.max(0.25, lyric.end - lyric.start);
    const japaneseLength = lyric.japanese.trim().length;
    const englishLength = (lyric.english || '').trim().length;
    const englishWords = (lyric.english || '').trim().split(/\s+/).filter(Boolean).length;

    // The lyric itself becomes part of the art direction. We deliberately use
    // semantic buckets rather than pure randomness so a quiet/short line can
    // produce a different kind of poster than a dense/dramatic line.
    const compact = lyric.japanese.replace(/\s/g, '');
    const counts = new Map<string, number>();
    for (const char of compact) counts.set(char, (counts.get(char) || 0) + 1);
    const repeatedCharacters = Array.from(counts.values()).filter(n => n > 1).reduce((sum, n) => sum + n - 1, 0);
    const repetition = compact.length ? repeatedCharacters / compact.length : 0;
    const hasQuestion = /[？?]/.test(`${lyric.japanese}${lyric.english || ''}`);
    const hasPunctuation = /[、。！？!?…—–,.:;]/.test(`${lyric.japanese}${lyric.english || ''}`);
    const density = Math.min(1, japaneseLength / 18 + englishWords / 18);
    const intensity = Math.min(1, 0.35 + (1 / duration) * 0.32 + (hasPunctuation ? 0.12 : 0) + (hasQuestion ? 0.1 : 0));
    const profile: LyricProfile = {
      japaneseLength,
      englishLength,
      englishWords,
      duration,
      density,
      intensity,
      repetition,
      hasPunctuation,
      hasQuestion,
      isShort: japaneseLength <= 6,
      isLong: japaneseLength >= 15 || englishWords >= 10,
      isQuiet: duration >= 4.5 && intensity < 0.58,
      isDramatic: intensity > 0.78 || hasQuestion,
    };

    const deviceSeedOffset = isMobile ? 100003 : 0;
    const seed = Math.floor(lyric.start * 1000) + index * 7919 + deviceSeedOffset;

    const desktopFamilies: VisualFamily[] = [
      'swiss-grid', 'bauhaus-orbit', 'typographic-monument', 'cropped-poster',
      'modular-blocks', 'kinetic-rules', 'vertical-editorial', 'negative-space',
    ];
    const mobileFamilies: VisualFamily[] = [
      'cropped-poster', 'modular-blocks', 'vertical-editorial', 'negative-space',
      'kinetic-rules', 'swiss-grid', 'bauhaus-orbit', 'typographic-monument',
    ];

    // Keep the FULL visual vocabulary available. Lyric semantics should bias
    // the art direction, not collapse it into a tiny set of families. This is
    // important for the generative feel: two quiet lines can still become very
    // different posters.
    const baseFamilies = isMobile ? mobileFamilies : desktopFamilies;
    const preferredFamilies: VisualFamily[] = profile.isQuiet
      ? ['negative-space', 'swiss-grid', 'vertical-editorial', 'typographic-monument']
      : profile.isDramatic
        ? ['cropped-poster', 'bauhaus-orbit', 'kinetic-rules', 'typographic-monument']
        : profile.isLong
          ? ['swiss-grid', 'modular-blocks', 'vertical-editorial', 'cropped-poster']
          : profile.repetition > 0.2
            ? ['modular-blocks', 'typographic-monument', 'kinetic-rules', 'swiss-grid']
            : ['swiss-grid', 'bauhaus-orbit', 'cropped-poster', 'modular-blocks'];

    // Weighted candidate list: preferred families appear twice, but every
    // family remains available. This gives semantic direction without making
    // consecutive loops feel like they belong to the same small template set.
    const families: VisualFamily[] = [
      ...baseFamilies,
      ...preferredFamilies,
      ...preferredFamilies,
    ];

    const desktopPatterns: CompositionPattern[] = [
      'oversized-japanese', 'japanese-left-english-right', 'vertical-japanese-horizontal-english',
      'overlapping-english', 'cropped-japanese', 'japanese-fill-english-notes', 'opposite-corners',
      'geometric-placement', 'rule-based', 'wrapped-around-shapes',
    ];
    const mobilePatterns: CompositionPattern[] = [
      'oversized-japanese', 'japanese-fill-english-notes', 'vertical-japanese-horizontal-english',
      'opposite-corners', 'rule-based', 'geometric-placement', 'overlapping-english',
    ];
    const desktopAnimations: AnimationStyle[] = [
      'character-reveal', 'word-stagger', 'vertical-wipe', 'horizontal-mask', 'clip-path',
      'blur-to-focus', 'tracking-expand', 'oversized-scale', 'slide-grid', 'cropped-reveal',
      'editorial-rotation', 'word-assembly', 'geometry-emerge', 'rectangle-reveal',
    ];
    const mobileAnimations: AnimationStyle[] = [
      'vertical-wipe', 'horizontal-mask', 'cropped-reveal', 'word-stagger', 'rectangle-reveal',
      'tracking-expand', 'slide-grid', 'editorial-rotation',
    ];
    const moods: MoodType[] = ['minimal', 'dramatic', 'elegant', 'bold', 'delicate', 'balanced'];
    const desktopLayouts = ['split', 'diagonal', 'grid', 'frame', 'minimal', 'vertical', 'dense', 'poster', 'editorial'];
    const mobileLayouts = ['stack', 'crop', 'column', 'frame', 'poster', 'split', 'vertical', 'tile'];
    const positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'corner'];

    const patterns = isMobile ? mobilePatterns : desktopPatterns;
    const animations = isMobile ? mobileAnimations : desktopAnimations;
    const layouts = isMobile ? mobileLayouts : desktopLayouts;

    const family = randomItem(families, seed + 101);
    const patternBias = profile.isShort ? 17 : profile.isLong ? 53 : profile.isDramatic ? 31 : profile.repetition > 0.2 ? 67 : 43;
    const pattern = randomItem(patterns, seed + patternBias);
    const animation = randomItem(animations, seed + 11 + Math.round(profile.intensity * 19));
    const mood = profile.isQuiet ? 'minimal' : profile.isDramatic ? 'dramatic' : randomItem(moods, seed + 21);
    const layout = randomItem(layouts, seed + 31 + Math.round(profile.density * 17));
    const emphasis = profile.isLong || profile.isDramatic
      ? 'japanese'
      : randomItem(['japanese', 'japanese', 'balanced', 'english'] as const, seed + 41);

    // All 28 compositions stay in the pool. Semantic preferences are soft
    // weights rather than hard filters, so the generator can still surprise.
    const allVariants = Array.from({ length: 28 }, (_, i) => i);
    const preferredVariants = profile.isQuiet
      ? [3, 6, 9, 13, 16, 20, 23]
      : profile.isShort
        ? [2, 5, 8, 18, 19, 24, 26]
        : profile.isLong
          ? [1, 4, 7, 10, 12, 21, 25, 27]
          : profile.isDramatic
            ? [2, 8, 17, 18, 19, 24, 26, 27]
            : profile.repetition > 0.2
              ? [1, 7, 11, 22, 25, 27]
              : [0, 4, 6, 10, 14, 15, 20, 21, 23, 26];
    const variantPool = [...allVariants, ...preferredVariants, ...preferredVariants];
    const variant = randomItem(variantPool, seed + 71 + (isMobile ? 401 : 0));

    return {
      pattern, animation, mood, emphasis, layout, family, variant, profile,
      metadata: {
        position: randomItem(positions, seed + 51),
        opacity: 0.22 + seededRandom(seed + 61) * 0.28,
      },
    };
  }, [currentLyric, isMobile]);

  // The visual index is intentionally different on mobile. CompositionEngine
  // uses lyricIndex as part of its deterministic visual generation, so this
  // makes colors/shapes/layouts different even when the lyric is identical.
  const visualLyricIndex = currentLyric
    ? currentLyric.index + (isMobile ? 10000 : 0)
    : 0;

  // Get composition data from engine
  const composition = useMemo(() => {
    if (!currentLyric || !compositionConfig) return null;
    
    const { lyric } = currentLyric;
    const context = {
      currentTime,
      lyricIndex: visualLyricIndex,
      totalLyrics: lyricsData.length,
      isPlaying,
      progress: (currentTime - lyric.start) / (lyric.end - lyric.start || 1),
    };
    return CompositionEngine.generateComposition(lyric, visualLyricIndex, lyricsData.length, context);
  }, [currentLyric, currentTime, isPlaying, compositionConfig, visualLyricIndex]);

  // Get background geometry config
  const bgConfig = useMemo((): GeometryConfig | null => {
    if (!currentLyric || !compositionConfig) return null;
    
    const { lyric } = currentLyric;
    const context = {
      currentTime,
      lyricIndex: visualLyricIndex,
      totalLyrics: lyricsData.length,
      isPlaying,
      progress: (currentTime - lyric.start) / (lyric.end - lyric.start || 1),
    };
    const comp = CompositionEngine.generateComposition(lyric, visualLyricIndex, lyricsData.length, context);
    
    return {
      shapes: CompositionEngine.getShapesForLyric(lyric, visualLyricIndex, context),
      colors: comp.colors,
    };
  }, [currentLyric, currentTime, isPlaying, compositionConfig, visualLyricIndex]);

  // If no lyric or in a gap, show a blank/ambient state
  if (!currentLyric || !composition || !bgConfig || !compositionConfig || isInGap) {
    // Show just the background with ambient shapes
    return (
      <div className={`fixed inset-0 z-10 overflow-hidden ${isMobile ? 'device-mobile' : 'device-desktop'}`}>
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

  const { lyric } = currentLyric;
  const { pattern, animation, mood, emphasis, metadata, family } = compositionConfig;
  
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
    // The mobile pattern is selected by the device-specific seeded composition,
    // not by lyric index alone. This gives mobile its own visual identity while
    // remaining deterministic across replays.
    return pattern;
  };

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
      return 'text-5xl md:text-7xl lg:text-8xl';
    }
    if (pattern === 'cropped-japanese') return 'text-5xl md:text-7xl lg:text-8xl';
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

  // The poster can be dramatic, but the lyric itself is never allowed to
  // become a cropped poster element. Font size responds to lyric length so
  // short lines can be huge while long lines remain inside the viewport.
  const japaneseResponsiveSize = isMobile
    ? `clamp(1.45rem, ${Math.max(4.6, Math.min(10.5, 17 - lyric.japanese.length * 0.42))}vw, 3.4rem)`
    : `clamp(2.7rem, ${Math.max(4.2, Math.min(9.2, 12.5 - lyric.japanese.length * 0.23))}vw, 9rem)`;
  const englishLength = Math.max(lyric.english?.length || 0, 1);
  const englishResponsiveSize = isMobile
    ? `clamp(.72rem, ${Math.max(2.6, Math.min(4.2, 5.2 - englishLength * 0.045))}vw, 1.15rem)`
    : `clamp(.78rem, ${Math.max(1.25, Math.min(2.25, 2.8 - englishLength * 0.025))}vw, 2rem)`;

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
            fontSize: japaneseResponsiveSize,
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
            fontSize: japaneseResponsiveSize,
            lineHeight: 1.2,
            maxWidth: '100%',
            wordBreak: 'break-word',
          };
        case 'japanese-fill-english-notes':
          return { 
            position: 'relative', 
            zIndex: 1, 
            textAlign: 'center' as const,
            fontSize: japaneseResponsiveSize,
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
            padding: 0,
          };
        case 'japanese-left-english-right':
          return { 
            position: 'relative' as const, 
            zIndex: 2, 
            marginTop: '0.25rem',
            textAlign: 'left' as const,
            paddingLeft: 0,
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
          };
        case 'japanese-fill-english-notes':
          return { 
            position: 'relative' as const, 
            zIndex: 2, 
            marginTop: '0.5rem',
            textAlign: 'center' as const,
            padding: '0.25rem 0.75rem',
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
          backdropFilter: 'blur(8px)',
          borderRadius: '4px',
        };
      case 'japanese-fill-english-notes':
        return { 
          position: 'relative' as const, 
          zIndex: 2, 
          marginTop: '1rem',
          textAlign: 'center' as const,
        };
      case 'overlapping-english':
        return { 
          position: 'relative' as const, 
          zIndex: 2, 
          marginTop: '1rem',
        };
      case 'geometric-placement':
        return { 
          position: 'absolute' as const, 
          bottom: '25%', 
          right: '15%', 
          zIndex: 2,
          backgroundColor: 'rgba(0,0,0,0.2)',
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

  // English visibility - always ensure it's readable
  const englishOpacity = emphasis === 'english' ? 1 : 0.94;

  const isDarkBackground = (() => {
    const hex = composition.colors.background.replace('#', '');
    if (hex.length !== 6) return false;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 145;
  })();
  const readableInk = isDarkBackground ? '#F7F3E8' : '#111111';
  // Keep the poster visible behind the lyrics. Readability comes from a restrained
  // print-style halo/stroke rather than a UI-like text card.
  const lyricStroke = isDarkBackground ? 'rgba(17,17,17,0.72)' : 'rgba(247,243,232,0.78)';
  const lyricShadow = isDarkBackground
    ? `0 1px 0 ${lyricStroke}, 1px 0 0 ${lyricStroke}, -1px 0 0 ${lyricStroke}, 0 -1px 0 ${lyricStroke}, 0 4px 18px rgba(0,0,0,0.18)`
    : `0 1px 0 ${lyricStroke}, 1px 0 0 ${lyricStroke}, -1px 0 0 ${lyricStroke}, 0 -1px 0 ${lyricStroke}, 0 4px 18px rgba(255,255,255,0.12)`;

  const familyArt = (
    <SwissPosterArt
      family={family}
      colors={composition.colors}
      index={index}
      currentTime={currentTime}
      variant={compositionConfig.variant}
      profile={compositionConfig.profile}
      dna={composition.dna}
      layout={composition.layout}
      typography={composition.typography}
    />
  );


  return (
    <div 
      className={`fixed inset-0 z-10 overflow-hidden ${isMobile ? 'device-mobile' : 'device-desktop'}`}
    >
      {/* Background - respect showBackground setting */}
      {settings.showBackground && (
        <InteractiveBackground 
          composition={bgConfig}
          isPlaying={isPlaying}
          currentTime={currentTime}
        />
      )}

      {/* Poster-to-poster transition: keep the old composition visible while the new
          one enters, so a lyric change feels like a designed editorial transition
          instead of a hard cut. */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`poster-art-${isMobile ? 'mobile' : 'desktop'}-${index}-${compositionConfig.variant}-${composition.colors.background}`}
          className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
          initial={{
            opacity: 0,
            scale: compositionConfig.profile.isDramatic ? 1.045 : 1.025,
            filter: compositionConfig.profile.isQuiet ? 'blur(2px)' : 'blur(5px)',
            clipPath: [
              'inset(0 100% 0 0)',
              'inset(0 0 0 100%)',
              'inset(100% 0 0 0)',
              'circle(0% at 50% 50%)',
              'polygon(0 0, 0 0, 0 100%, 0 100%)',
              'inset(0 12% 0 0)',
            ][compositionConfig.variant % 6],
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            clipPath: ['inset(0 0 0 0)','inset(0 0 0 0)','inset(0 0 0 0)','circle(100% at 50% 50%)','polygon(0 0, 100% 0, 100% 100%, 0 100%)','inset(0 0 0 0)'][compositionConfig.variant % 6],
          }}
          exit={{
            opacity: 0,
            scale: 0.985,
            filter: 'blur(3px)',
            x: index % 2 === 0 ? -10 : 10,
          }}
          transition={{
            duration: settings.enableAnimations ? 0.82 : 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {familyArt}
        </motion.div>
      </AnimatePresence>
      
      {/* Content Layer */}
      <div className={`absolute inset-0 flex items-center justify-center z-10 safe-lyric-viewport ${
        isMobile ? 'px-3 py-[max(4.5rem,env(safe-area-inset-top))] pb-[max(5.5rem,env(safe-area-inset-bottom))]' : 'px-6 md:px-12 lg:px-16 py-20'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`composition-${index}`}
            className={`w-full ${isMobile ? 'max-w-[94vw]' : 'max-w-[86vw]'} max-h-[72vh] overflow-visible ${patternLayout} relative loop-composition visual-family-content visual-content-${family} safe-lyric-content`}
            style={{
              ['--loop-tilt' as any]: `${(seededRandom(index * 17 + 3) - 0.5) * 2.4}deg`,
              ['--loop-shift' as any]: `${(seededRandom(index * 17 + 7) - 0.5) * 1.5}vw`,
            }}
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
                className={`${japaneseSize} ${pattern === 'vertical-japanese-horizontal-english' && !isMobile ? 'writing-vertical' : ''} relative lyric-primary`}
                style={{
                  ...japaneseStyle,
                  ...japaneseEffects,
                  color: readableInk,
                  fontSize: japaneseResponsiveSize,
                  ...japanesePos,
                  display: 'block',
                  width: 'fit-content',
                  maxWidth: isMobile ? '88vw' : '82vw',
                  maxHeight: isMobile ? '42vh' : '54vh',
                  overflow: 'visible',
                  overflowWrap: 'anywhere',
                  wordBreak: 'normal',
                  whiteSpace: 'normal',
                  textWrap: 'balance',
                  hyphens: 'none',
                  lineHeight: isMobile ? 1.08 : 1.02,
                  padding: 0,
                  margin: 0,
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  backdropFilter: 'none',
                  WebkitTextStroke: isMobile ? '0.018em transparent' : '0.014em transparent',
                  paintOrder: 'stroke fill',
                  textShadow: lyricShadow,
                  
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
                  color: readableInk,
                  fontSize: englishResponsiveSize,
                  ...englishPos,
                  display: 'block',
                  width: 'fit-content',
                  maxWidth: isMobile ? '88vw' : '70vw',
                  maxHeight: isMobile ? '20vh' : '18vh',
                  overflow: 'visible',
                  overflowWrap: 'anywhere',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  textWrap: 'balance',
                  padding: 0,
                  margin: 0,
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  backdropFilter: 'none',
                  opacity: englishOpacity * (settings.textOpacity / 100),
                  WebkitTextStroke: isMobile ? '0.012em transparent' : '0.009em transparent',
                  paintOrder: 'stroke fill',
                  textShadow: lyricShadow,
                  position: englishPos.position || 'relative',
                  zIndex: englishPos.zIndex || 2,
                  ...(isMobile && mobilePattern === 'opposite-corners' ? { 
                    alignSelf: 'flex-end',
                    marginTop: '0.5rem',
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
          .safe-lyric-content {
            min-height: 0;
          }
          .lyric-primary {
            max-width: 92vw;
            overflow: visible;
          }
          .lyric-primary span {
            max-width: 100%;
          }
          .writing-vertical {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            max-height: 44vh;
          }
        }
      `}</style>
    </div>
  );
};

export default PosterComposition;