import { CompositionPreset } from '../types/composition';
import { seededRandom, seededRandomBetween, seededRandomInt } from '../utils/seededRandom';

// All possible layout variations
const layoutTypes = [
  'huge-japanese-tiny-english',
  'tiny-japanese-huge-english',
  'vertical-japanese-horizontal-english',
  'english-overlaps-japanese',
  'japanese-left-english-right',
  'split-top-bottom',
  'diagonal',
  'framed',
  'minimal',
  'japanese-right-english-left',
  'top-heavy',
  'bottom-heavy',
  'center-out',
  'asymmetric',
];

const japaneseSizes = [
  'text-5xl md:text-6xl lg:text-7xl',
  'text-6xl md:text-7xl lg:text-8xl',
  'text-7xl md:text-8xl lg:text-9xl',
  'text-8xl md:text-9xl lg:text-[10rem]',
  'text-4xl md:text-5xl lg:text-6xl',
  'text-3xl md:text-4xl lg:text-5xl',
];

const englishSizes = [
  'text-sm md:text-base lg:text-lg',
  'text-base md:text-lg lg:text-xl',
  'text-xl md:text-2xl lg:text-3xl',
  'text-2xl md:text-3xl lg:text-4xl',
  'text-3xl md:text-4xl lg:text-5xl',
  'text-4xl md:text-5xl lg:text-6xl',
  'text-5xl md:text-6xl lg:text-7xl',
  'text-6xl md:text-7xl lg:text-8xl',
];

const alignments = ['text-center', 'text-left', 'text-right'];
const metadataPositions = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'corner'];
const containerClasses = [
  'flex flex-col items-center justify-center gap-2 w-full',
  'flex flex-col items-center justify-center gap-4 w-full',
  'flex flex-col items-center justify-center gap-6 w-full',
  'flex flex-row items-center justify-between w-full gap-8',
  'flex flex-row items-center justify-center w-full gap-12',
  'grid grid-cols-2 gap-8 w-full',
  'flex flex-col items-start justify-center w-full gap-4 pl-8',
  'flex flex-col items-end justify-center w-full gap-4 pr-8',
  'flex flex-col items-center justify-end w-full gap-4 pb-16',
  'flex flex-col items-center justify-start w-full gap-4 pt-16',
];

// Generate a random composition for a specific lyric index
export const generateComposition = (index: number): CompositionPreset => {
  const seed = index * 1000 + 42;
  
  const layout = layoutTypes[seededRandomInt(seed, 0, layoutTypes.length - 1)];
  const japaneseSize = japaneseSizes[seededRandomInt(seed + 1, 0, japaneseSizes.length - 1)];
  const englishSize = englishSizes[seededRandomInt(seed + 2, 0, englishSizes.length - 1)];
  const japaneseAlign = alignments[seededRandomInt(seed + 3, 0, alignments.length - 1)];
  const englishAlign = alignments[seededRandomInt(seed + 4, 0, alignments.length - 1)];
  const containerClass = containerClasses[seededRandomInt(seed + 5, 0, containerClasses.length - 1)];
  const metadataPosition = metadataPositions[seededRandomInt(seed + 6, 0, metadataPositions.length - 1)];
  const gridColumns = seededRandom(seed + 7) > 0.5 ? 2 : 1;
  
  const japaneseWriting = seededRandom(seed + 8) > 0.7 ? 'vertical-rl' : undefined;
  const englishOverlay = seededRandom(seed + 9) > 0.8;
  const japaneseOpacity = seededRandomBetween(seed + 10, 0.3, 1);
  const englishOpacity = seededRandomBetween(seed + 11, 0.3, 1);
  const englishBlur = seededRandom(seed + 12) > 0.7;

  return {
    layout,
    japaneseSize,
    englishSize,
    japaneseAlign,
    englishAlign,
    containerClass,
    metadataPosition,
    gridColumns,
    japaneseWriting,
    englishOverlay,
    japaneseOpacity,
    englishOpacity,
    englishBlur,
  };
};

// Get composition for a lyric (memoized per index)
const compositionCache: Record<number, CompositionPreset> = {};

export const getComposition = (index: number): CompositionPreset => {
  if (!compositionCache[index]) {
    compositionCache[index] = generateComposition(index);
  }
  return compositionCache[index];
};

// Export for backward compatibility
export const LYRIC_COMPOSITIONS: Record<number, CompositionPreset> = {};
for (let i = 0; i < 20; i++) {
  LYRIC_COMPOSITIONS[i] = getComposition(i);
}