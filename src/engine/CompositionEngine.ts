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

// Seed-based random number generator - FIXED to handle seed properly
const seededRandom = (seed: number): number => {
  // Ensure seed is a positive number
  const safeSeed = Math.abs(seed) + 0.1;
  const x = Math.sin(safeSeed * 127.1 + 311.7) * 43758.5453123;
  const result = x - Math.floor(x);
  return Math.max(0, Math.min(1, result));
};

// Get random item from array using seed - FIXED with safe index
const randomItem = <T,>(arr: T[], seed: number): T => {
  if (!arr || arr.length === 0) return arr as any;
  const safeSeed = Math.abs(seed);
  const index = Math.floor(seededRandom(safeSeed) * arr.length);
  return arr[Math.min(index, arr.length - 1)];
};

// Generate random number between min and max using seed - FIXED
const randomBetween = (seed: number, min: number, max: number): number => {
  const safeSeed = Math.abs(seed) + 0.1;
  const random = seededRandom(safeSeed);
  return random * (max - min) + min;
};

// Generate random DNA using lyric index as seed
const generateRandomDNA = (seed: number): CompositionDNA => {
  const safeSeed = Math.abs(seed) + 0.1;
  return {
    dominantShape: randomItem(geometryPresets, safeSeed),
    density: randomBetween(safeSeed + 1, 0.2, 0.8),
    symmetry: randomBetween(safeSeed + 2, 0.1, 0.9),
    overlap: randomBetween(safeSeed + 3, 0, 0.8),
    whitespace: randomBetween(safeSeed + 4, 0.2, 0.95),
    readingFlow: randomItem(readingFlows, safeSeed + 5),
    emphasis: randomItem(emphases, safeSeed + 6),
    backgroundIntensity: randomBetween(safeSeed + 7, 0.3, 0.8),
    geometryScale: randomBetween(safeSeed + 8, 0.7, 1.5),
    motionIntensity: randomBetween(safeSeed + 9, 0.2, 0.8)
  };
};

// Generate random metadata preset using seed
const generateRandomMetadata = (seed: number) => {
  const safeSeed = Math.abs(seed) + 0.1;
  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'corner'];
  return {
    showArtist: seededRandom(safeSeed) > 0.3,
    showTitle: seededRandom(safeSeed + 1) > 0.2,
    showYear: seededRandom(safeSeed + 2) > 0.3,
    showTrack: seededRandom(safeSeed + 3) > 0.4,
    showTime: true,
    showLine: seededRandom(safeSeed + 4) > 0.3,
    position: randomItem(positions, safeSeed + 5) as any
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
      const cached = compositionCache.get(cacheKey);
      if (cached) return cached;
    }
    
    try {
      // Generate new composition with safe seed
      const seed = Math.abs(index * 100 + lyric.start * 10) + 0.1;
      
      // Get random items with safe seeds
      const layoutSeed = seed + 1;
      const geometrySeed = seed + 10;
      const typographySeed = seed + 20;
      const motionSeed = seed + 30;
      const dnaSeed = seed + 40;
      const metadataSeed = seed + 50;
      const colorSeed = seed + 60;
      
      const layout = randomItem(layoutPresets, layoutSeed);
      const geometry = randomItem(geometryPresets, geometrySeed);
      const typography = randomItem(typographyPresets, typographySeed);
      const motion = randomItem(motionPresets, motionSeed);
      const dna = generateRandomDNA(dnaSeed);
      const metadata = generateRandomMetadata(metadataSeed);
      const colors = randomItem(colorPalettes, colorSeed);
      
      // Adjust DNA for the lyric
      const adjustedDNA = this.adjustDNAForLyric(dna, lyric, index, context, seed + 70);
      
      // Ensure we have valid colors
      const safeColors = {
        primary: colors?.primary || '#E94560',
        secondary: colors?.secondary || '#3498DB',
        accent: colors?.accent || '#F1C40F',
        background: colors?.background || '#111111',
        text: colors?.text || '#F5F5F5',
      };
      
      const composition: Composition = {
        layout: layout || 'hero',
        geometry: geometry || 'none',
        typography: typography || 'balanced',
        metadata: metadata || {
          showArtist: true,
          showTitle: true,
          showYear: true,
          showTrack: true,
          showTime: true,
          showLine: true,
          position: 'bottom-left'
        },
        motion: motion || 'fade',
        dna: adjustedDNA || {
          dominantShape: 'none',
          density: 0.5,
          symmetry: 0.5,
          overlap: 0.3,
          whitespace: 0.6,
          readingFlow: 'left-right',
          emphasis: 'balanced',
          backgroundIntensity: 0.5,
          geometryScale: 1,
          motionIntensity: 0.5
        },
        colors: safeColors,
        grid: {
          columns: 12,
          gutter: randomBetween(seed + 90, 16, 32),
          margin: randomBetween(seed + 100, 32, 64)
        }
      };
      
      // Cache the composition
      compositionCache.set(cacheKey, composition);
      
      return composition;
      
    } catch (error) {
      console.warn(`Error generating composition for lyric ${index}:`, error);
      
      // Return a default composition
      const defaultComposition: Composition = {
        layout: 'hero',
        geometry: 'none',
        typography: 'balanced',
        metadata: {
          showArtist: true,
          showTitle: true,
          showYear: true,
          showTrack: true,
          showTime: true,
          showLine: true,
          position: 'bottom-left'
        },
        motion: 'fade',
        dna: {
          dominantShape: 'none',
          density: 0.5,
          symmetry: 0.5,
          overlap: 0.3,
          whitespace: 0.6,
          readingFlow: 'left-right',
          emphasis: 'balanced',
          backgroundIntensity: 0.5,
          geometryScale: 1,
          motionIntensity: 0.5
        },
        colors: {
          primary: '#E94560',
          secondary: '#3498DB',
          accent: '#F1C40F',
          background: '#111111',
          text: '#F5F5F5',
        },
        grid: {
          columns: 12,
          gutter: 24,
          margin: 48
        }
      };
      
      compositionCache.set(cacheKey, defaultComposition);
      return defaultComposition;
    }
  }
  
  private static adjustDNAForLyric(dna: CompositionDNA, lyric: LyricLine, index: number, context?: CompositionContext, seed?: number): CompositionDNA {
    try {
      const lengthFactor = Math.min(lyric.japanese.length / 20, 1);
      const density = Math.min(dna.density + lengthFactor * 0.2, 1);
      
      let whitespace = dna.whitespace;
      if (lyric.japanese.length > 15) whitespace = Math.max(whitespace - 0.2, 0.1);
      if (lyric.japanese.length < 5) whitespace = Math.min(whitespace + 0.2, 0.95);
      
      const emphasisOptions: ('japanese' | 'english' | 'balanced')[] = ['japanese', 'japanese', 'balanced', 'english', 'japanese'];
      const emphasis = emphasisOptions[index % emphasisOptions.length] || 'balanced';
      
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
        geometryScale: dna.geometryScale * (0.8 + (seed ? seededRandom(Math.abs(seed)) * 0.4 : 0.2)),
      };
    } catch (error) {
      console.warn(`Error adjusting DNA for lyric ${index}:`, error);
      return dna;
    }
  }
  
  // Get shapes for the background
  static getShapesForLyric(lyric: LyricLine, index: number, context?: CompositionContext): Shape[] {
    try {
      const seed = Math.abs(index * 100 + lyric.start * 10) + 0.1;
      const composition = this.generateComposition(lyric, index, 0, context);
      
      // Generate shapes based on the composition's geometry
      const shapes: Shape[] = [];
      const colorPalette = composition.colors;
      const colorOptions = [colorPalette.primary, colorPalette.secondary, colorPalette.accent];
      
      const shapeTypes: ('circle' | 'rectangle' | 'triangle' | 'line')[] = ['circle', 'rectangle', 'triangle', 'line'];
      const numShapes = 4 + Math.floor(seededRandom(seed + 1000) * 4);
      
      for (let i = 0; i < numShapes; i++) {
        const s = seed + i * 100 + 2000;
        const type = shapeTypes[Math.floor(seededRandom(Math.abs(s)) * shapeTypes.length)] || 'circle';
        const color = colorOptions[Math.floor(seededRandom(Math.abs(s + 10)) * colorOptions.length)] || colorPalette.primary;
        
        shapes.push({
          type: type as any,
          x: randomBetween(Math.abs(s + 20), 5, 95),
          y: randomBetween(Math.abs(s + 30), 5, 95),
          width: randomBetween(Math.abs(s + 40), 60, 350),
          height: randomBetween(Math.abs(s + 50), 60, 350),
          rotation: randomBetween(Math.abs(s + 60), -45, 45),
          color: color,
          opacity: randomBetween(Math.abs(s + 70), 0.15, 0.4),
        });
      }
      
      return shapes;
      
    } catch (error) {
      console.warn(`Error generating shapes for lyric ${index}:`, error);
      // Return default shapes
      return [
        {
          type: 'circle',
          x: 25,
          y: 25,
          width: 200,
          height: 200,
          rotation: 0,
          color: '#E94560',
          opacity: 0.15,
        },
        {
          type: 'rectangle',
          x: 60,
          y: 60,
          width: 150,
          height: 150,
          rotation: 15,
          color: '#3498DB',
          opacity: 0.12,
        }
      ];
    }
  }
  
  // Get background config (shapes + colors)
  static getBackgroundConfig(lyric: LyricLine, index: number, context?: CompositionContext): GeometryConfig {
    try {
      const composition = this.generateComposition(lyric, index, 0, context);
      const shapes = this.getShapesForLyric(lyric, index, context);
      
      return {
        shapes: shapes || [],
        colors: composition.colors || {
          primary: '#E94560',
          secondary: '#3498DB',
          accent: '#F1C40F',
          background: '#111111',
          text: '#F5F5F5',
        },
      };
    } catch (error) {
      console.warn(`Error generating background config for lyric ${index}:`, error);
      return {
        shapes: [],
        colors: {
          primary: '#E94560',
          secondary: '#3498DB',
          accent: '#F1C40F',
          background: '#111111',
          text: '#F5F5F5',
        },
      };
    }
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
    try {
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
        opacity: composition.dna.backgroundIntensity || 0.5,
        content: { color: composition.colors.background || '#111111' }
      });
      
      layers.push({
        id: 'grid',
        type: 'grid',
        zIndex: 2,
        opacity: 0.05,
        content: { columns: composition.grid?.columns || 12 }
      });
      
      if (composition.geometry && composition.geometry !== 'none') {
        layers.push({
          id: 'geometry',
          type: 'geometry',
          zIndex: 3,
          opacity: (composition.dna.density || 0.5) * 0.5,
          content: { 
            shape: composition.geometry,
            scale: composition.dna.geometryScale || 1
          }
        });
      }
      
      layers.push({
        id: 'backgroundText',
        type: 'backgroundText',
        zIndex: 4,
        opacity: (composition.dna.whitespace || 0.6) * 0.04,
        content: null
      });
      
      layers.push({
        id: 'primaryText',
        type: 'primaryText',
        zIndex: 5,
        opacity: 1,
        content: { 
          emphasis: composition.dna.emphasis || 'balanced',
          color: composition.colors.primary || '#E94560'
        }
      });
      
      layers.push({
        id: 'annotation',
        type: 'annotation',
        zIndex: 6,
        opacity: composition.dna.emphasis === 'english' ? 0.9 : 0.6,
        content: { color: composition.colors.secondary || '#3498DB' }
      });
      
      layers.push({
        id: 'metadata',
        type: 'metadata',
        zIndex: 7,
        opacity: 0.5,
        content: composition.metadata || {
          showArtist: true,
          showTitle: true,
          showYear: true,
          showTrack: true,
          showTime: true,
          showLine: true,
          position: 'bottom-left'
        }
      });
      
      return layers;
      
    } catch (error) {
      console.warn('Error generating layer order:', error);
      return [];
    }
  }
  
  // Helper method to get background composition data
  static getBackgroundData(composition: Composition): any {
    return {
      colors: composition.colors || {
        primary: '#E94560',
        secondary: '#3498DB',
        accent: '#F1C40F',
        background: '#111111',
        text: '#F5F5F5',
      },
      dna: composition.dna || {
        dominantShape: 'none',
        density: 0.5,
        symmetry: 0.5,
        overlap: 0.3,
        whitespace: 0.6,
        readingFlow: 'left-right',
        emphasis: 'balanced',
        backgroundIntensity: 0.5,
        geometryScale: 1,
        motionIntensity: 0.5
      },
      geometry: composition.geometry || 'none',
      layout: composition.layout || 'hero'
    };
  }
  
  // Helper method to get lyric composition data
  static getLyricData(composition: Composition): any {
    return {
      typography: composition.typography || 'balanced',
      dna: composition.dna || {
        dominantShape: 'none',
        density: 0.5,
        symmetry: 0.5,
        overlap: 0.3,
        whitespace: 0.6,
        readingFlow: 'left-right',
        emphasis: 'balanced',
        backgroundIntensity: 0.5,
        geometryScale: 1,
        motionIntensity: 0.5
      },
      colors: composition.colors || {
        primary: '#E94560',
        secondary: '#3498DB',
        accent: '#F1C40F',
        background: '#111111',
        text: '#F5F5F5',
      },
      layout: composition.layout || 'hero',
      motion: composition.motion || 'fade',
      metadata: composition.metadata || {
        showArtist: true,
        showTitle: true,
        showYear: true,
        showTrack: true,
        showTime: true,
        showLine: true,
        position: 'bottom-left'
      }
    };
  }
}

export default CompositionEngine;