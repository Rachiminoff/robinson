import { Composition, CompositionDNA, LayoutPreset, GeometryPreset, TypographyPreset, MotionPreset, Layer, CompositionContext, Shape, GeometryConfig } from '../types/composition';
import { LyricLine } from '../types';

// Extended color palettes
const colorPalettes = [
  { primary: '#E94560', secondary: '#3498DB', accent: '#F1C40F', background: '#111111', text: '#F5F5F5' },
  { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D', background: '#111111', text: '#F5F5F5' },
  { primary: '#A8E6CF', secondary: '#FF8B94', accent: '#FFD93D', background: '#111111', text: '#F5F5F5' },
  { primary: '#6C5CE7', secondary: '#00CEC9', accent: '#FDCB6E', background: '#111111', text: '#F5F5F5' },
  { primary: '#FD79A8', secondary: '#00B894', accent: '#FDCB6E', background: '#111111', text: '#F5F5F5' },
  { primary: '#00B894', secondary: '#E17055', accent: '#FDCB6E', background: '#111111', text: '#F5F5F5' },
  { primary: '#0984E3', secondary: '#FDCB6E', accent: '#E17055', background: '#111111', text: '#F5F5F5' },
  { primary: '#E17055', secondary: '#00CEC9', accent: '#FDCB6E', background: '#111111', text: '#F5F5F5' },
  { primary: '#A29BFE', secondary: '#FD79A8', accent: '#FDCB6E', background: '#111111', text: '#F5F5F5' },
  { primary: '#55EFC4', secondary: '#FD79A8', accent: '#FDCB6E', background: '#111111', text: '#F5F5F5' },
  { primary: '#FDCB6E', secondary: '#E17055', accent: '#00CEC9', background: '#111111', text: '#F5F5F5' },
  { primary: '#FF9FF3', secondary: '#54A0FF', accent: '#FFDA79', background: '#111111', text: '#F5F5F5' },
  { primary: '#FF6348', secondary: '#7BED9F', accent: '#FFDA79', background: '#111111', text: '#F5F5F5' },
  { primary: '#70A1FF', secondary: '#FF6B81', accent: '#FFDA79', background: '#111111', text: '#F5F5F5' },
  { primary: '#FF6B81', secondary: '#70A1FF', accent: '#FFDA79', background: '#111111', text: '#F5F5F5' },
];

// All possible layout presets
const layoutPresets: LayoutPreset[] = [
  'hero', 'diagonal', 'grid', 'frame', 'minimal', 'split', 'vertical', 'dense'
];

// All possible geometry presets
const geometryPresets: GeometryPreset[] = [
  'circle', 'rectangle', 'square', 'triangle', 'horizontalRule', 'verticalRule', 'borders', 'none'
];

// All possible typography presets
const typographyPresets: TypographyPreset[] = [
  'dominantJapanese', 'balanced', 'englishFocused', 'japaneseCropped', 'minimalist', 'editorial'
];

// All possible motion presets
const motionPresets: MotionPreset[] = [
  'fade', 'slide', 'reveal', 'assemble', 'static', 'splitReveal'
];

// Reading flow options
const readingFlows: ('left-right' | 'right-left' | 'top-bottom' | 'bottom-top' | 'center-out')[] = [
  'left-right', 'right-left', 'top-bottom', 'bottom-top', 'center-out'
];

// Emphasis options
const emphases: ('japanese' | 'english' | 'balanced')[] = [
  'japanese', 'japanese', 'balanced', 'english'
];

// Seed-based random number generator
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

// Get random item from array using seed
const randomItem = <T,>(arr: T[], seed: number): T => {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index % arr.length];
};

// Generate random number between min and max using seed
const randomBetween = (seed: number, min: number, max: number): number => {
  return seededRandom(seed) * (max - min) + min;
};

// Generate random DNA using lyric index as seed
const generateRandomDNA = (seed: number): CompositionDNA => {
  return {
    dominantShape: randomItem(geometryPresets, seed),
    density: randomBetween(seed + 1, 0.2, 0.8),
    symmetry: randomBetween(seed + 2, 0.1, 0.9),
    overlap: randomBetween(seed + 3, 0, 0.8),
    whitespace: randomBetween(seed + 4, 0.2, 0.95),
    readingFlow: randomItem(readingFlows, seed + 5),
    emphasis: randomItem(emphases, seed + 6),
    backgroundIntensity: randomBetween(seed + 7, 0.3, 0.8),
    geometryScale: randomBetween(seed + 8, 0.7, 1.5),
    motionIntensity: randomBetween(seed + 9, 0.2, 0.8)
  };
};

// Generate random metadata preset using seed
const generateRandomMetadata = (seed: number) => {
  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'corner'];
  return {
    showArtist: seededRandom(seed) > 0.3,
    showTitle: seededRandom(seed + 1) > 0.2,
    showYear: seededRandom(seed + 2) > 0.3,
    showTrack: seededRandom(seed + 3) > 0.4,
    showTime: true,
    showLine: seededRandom(seed + 4) > 0.3,
    position: randomItem(positions, seed + 5) as any
  };
};

// Cache for compositions - ensures each lyric gets a consistent composition
const compositionCache: Map<number, Composition> = new Map();

export class CompositionEngine {
  
  static generateComposition(lyric: LyricLine, index: number, total: number, context?: CompositionContext): Composition {
    // Use lyric index as cache key
    const cacheKey = index;
    
    // Check if we already have a composition for this lyric
    if (compositionCache.has(cacheKey)) {
      return compositionCache.get(cacheKey)!;
    }
    
    // Generate new composition
    const seed = index * 100 + lyric.start * 10;
    
    const layout = randomItem(layoutPresets, seed);
    const geometry = randomItem(geometryPresets, seed + 10);
    const typography = randomItem(typographyPresets, seed + 20);
    const motion = randomItem(motionPresets, seed + 30);
    const dna = generateRandomDNA(seed + 40);
    const metadata = generateRandomMetadata(seed + 50);
    const colors = randomItem(colorPalettes, seed + 60);
    
    const adjustedDNA = this.adjustDNAForLyric(dna, lyric, index, context, seed + 70);
    
    const composition: Composition = {
      layout,
      geometry,
      typography,
      metadata,
      motion,
      dna: adjustedDNA,
      colors: {
        ...colors,
        background: seededRandom(seed + 80) > 0.7 ? '#1a1a1a' : colors.background,
      },
      grid: {
        columns: 12,
        gutter: randomBetween(seed + 90, 16, 32),
        margin: randomBetween(seed + 100, 32, 64)
      }
    };
    
    // Cache the composition
    compositionCache.set(cacheKey, composition);
    
    return composition;
  }
  
  private static adjustDNAForLyric(dna: CompositionDNA, lyric: LyricLine, index: number, context?: CompositionContext, seed?: number): CompositionDNA {
    const lengthFactor = Math.min(lyric.japanese.length / 20, 1);
    const density = Math.min(dna.density + lengthFactor * 0.2, 1);
    
    let whitespace = dna.whitespace;
    if (lyric.japanese.length > 15) whitespace = Math.max(whitespace - 0.2, 0.1);
    if (lyric.japanese.length < 5) whitespace = Math.min(whitespace + 0.2, 0.95);
    
    const emphasisOptions: ('japanese' | 'english' | 'balanced')[] = ['japanese', 'japanese', 'balanced', 'english', 'japanese'];
    const emphasis = emphasisOptions[index % emphasisOptions.length];
    
    let backgroundIntensity = dna.backgroundIntensity;
    if (context?.isPlaying) {
      backgroundIntensity = Math.min(backgroundIntensity + 0.05, 0.9);
    }
    
    return {
      ...dna,
      density,
      whitespace,
      emphasis,
      backgroundIntensity,
      geometryScale: dna.geometryScale * (0.8 + seededRandom(seed || index) * 0.4),
    };
  }
  
  // Get shapes for the background
  static getShapesForLyric(lyric: LyricLine, index: number, context?: CompositionContext): Shape[] {
    const seed = index * 100 + lyric.start * 10;
    const composition = this.generateComposition(lyric, index, 0, context);
    
    // Generate shapes based on the composition's geometry
    const shapes: Shape[] = [];
    const colorPalette = composition.colors;
    const colorOptions = [colorPalette.primary, colorPalette.secondary, colorPalette.accent];
    
    const shapeTypes: ('circle' | 'rectangle' | 'triangle' | 'line')[] = ['circle', 'rectangle', 'triangle', 'line'];
    const numShapes = 4 + Math.floor(seededRandom(seed + 1000) * 4);
    
    for (let i = 0; i < numShapes; i++) {
      const s = seed + i * 100 + 2000;
      const type = shapeTypes[Math.floor(seededRandom(s) * shapeTypes.length)];
      const color = colorOptions[Math.floor(seededRandom(s + 10) * colorOptions.length)];
      
      shapes.push({
        type,
        x: randomBetween(s + 20, 5, 95),
        y: randomBetween(s + 30, 5, 95),
        width: randomBetween(s + 40, 60, 350),
        height: randomBetween(s + 50, 60, 350),
        rotation: randomBetween(s + 60, -45, 45),
        color,
        opacity: randomBetween(s + 70, 0.15, 0.4),
      });
    }
    
    return shapes;
  }
  
  // Get background config (shapes + colors)
  static getBackgroundConfig(lyric: LyricLine, index: number, context?: CompositionContext): GeometryConfig {
    const composition = this.generateComposition(lyric, index, 0, context);
    const shapes = this.getShapesForLyric(lyric, index, context);
    
    return {
      shapes,
      colors: composition.colors,
    };
  }
  
  // Clear cache - useful for development
  static clearCache(): void {
    compositionCache.clear();
  }
  
  // Get cache size
  static getCacheSize(): number {
    return compositionCache.size;
  }
  
  static getLayerOrder(composition: Composition): Layer[] {
    const layers: Layer[] = [];
    
    layers.push({
      id: 'texture',
      type: 'texture',
      zIndex: 0,
      opacity: 0.03,
      content: null
    });
    
    layers.push({
      id: 'background',
      type: 'background',
      zIndex: 1,
      opacity: composition.dna.backgroundIntensity,
      content: { color: composition.colors.background }
    });
    
    layers.push({
      id: 'grid',
      type: 'grid',
      zIndex: 2,
      opacity: 0.05,
      content: { columns: composition.grid.columns }
    });
    
    if (composition.geometry !== 'none') {
      layers.push({
        id: 'geometry',
        type: 'geometry',
        zIndex: 3,
        opacity: composition.dna.density * 0.5,
        content: { 
          shape: composition.geometry,
          scale: composition.dna.geometryScale
        }
      });
    }
    
    layers.push({
      id: 'backgroundText',
      type: 'backgroundText',
      zIndex: 4,
      opacity: composition.dna.whitespace * 0.04,
      content: null
    });
    
    layers.push({
      id: 'primaryText',
      type: 'primaryText',
      zIndex: 5,
      opacity: 1,
      content: { 
        emphasis: composition.dna.emphasis,
        color: composition.colors.primary
      }
    });
    
    layers.push({
      id: 'annotation',
      type: 'annotation',
      zIndex: 6,
      opacity: composition.dna.emphasis === 'english' ? 0.9 : 0.6,
      content: { color: composition.colors.secondary }
    });
    
    layers.push({
      id: 'metadata',
      type: 'metadata',
      zIndex: 7,
      opacity: 0.5,
      content: composition.metadata
    });
    
    return layers;
  }
  
  // Helper method to get background composition data
  static getBackgroundData(composition: Composition): any {
    return {
      colors: composition.colors,
      dna: composition.dna,
      geometry: composition.geometry,
      layout: composition.layout
    };
  }
  
  // Helper method to get lyric composition data
  static getLyricData(composition: Composition): any {
    return {
      typography: composition.typography,
      dna: composition.dna,
      colors: composition.colors,
      layout: composition.layout,
      motion: composition.motion,
      metadata: composition.metadata
    };
  }
}

export default CompositionEngine;