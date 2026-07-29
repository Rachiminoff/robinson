// src/types/composition.ts

export type LayoutPreset = 
  | 'hero'
  | 'diagonal'
  | 'grid'
  | 'frame'
  | 'minimal'
  | 'split'
  | 'vertical'
  | 'dense';

export type GeometryPreset = 
  | 'circle'
  | 'rectangle'
  | 'square'
  | 'triangle'
  | 'horizontalRule'
  | 'verticalRule'
  | 'borders'
  | 'none';

export type TypographyPreset = 
  | 'dominantJapanese'
  | 'balanced'
  | 'englishFocused'
  | 'japaneseCropped'
  | 'minimalist'
  | 'editorial';

export type MotionPreset = 
  | 'fade'
  | 'slide'
  | 'reveal'
  | 'assemble'
  | 'static'
  | 'splitReveal';

export interface MetadataPreset {
  showArtist: boolean;
  showTitle: boolean;
  showYear: boolean;
  showTrack: boolean;
  showTime: boolean;
  showLine: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'corner';
}

export interface CompositionDNA {
  dominantShape: GeometryPreset;
  density: number; // 0-1
  symmetry: number; // 0-1
  overlap: number; // 0-1
  whitespace: number; // 0-1
  readingFlow: 'left-right' | 'right-left' | 'top-bottom' | 'bottom-top' | 'center-out';
  emphasis: 'japanese' | 'english' | 'balanced';
  backgroundIntensity: number; // 0-1 - controls background elements
  geometryScale: number; // 0.5-1.5 - controls size of geometric elements
  motionIntensity: number; // 0-1 - controls animation intensity
}

export interface Composition {
  layout: LayoutPreset;
  geometry: GeometryPreset;
  typography: TypographyPreset;
  metadata: MetadataPreset;
  motion: MotionPreset;
  dna: CompositionDNA;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  grid: {
    columns: number;
    gutter: number;
    margin: number;
  };
}

export interface Layer {
  id: string;
  type: 'texture' | 'grid' | 'geometry' | 'backgroundText' | 'primaryText' | 'annotation' | 'metadata' | 'background';
  zIndex: number;
  opacity: number;
  content: any;
}

export interface CompositionContext {
  currentTime: number;
  lyricIndex: number;
  totalLyrics: number;
  isPlaying: boolean;
  progress: number;
  seed?: number;
}

// Shape types for the background engine
export interface Shape {
  type: 'circle' | 'rectangle' | 'triangle' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  opacity: number;
}

export interface GeometryConfig {
  shapes: Shape[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

// Composition preset for lyric layouts
export interface CompositionPreset {
  layout: string;
  japaneseSize: string;
  englishSize: string;
  japaneseAlign: string;
  englishAlign: string;
  containerClass: string;
  metadataPosition: string;
  gridColumns?: number;
  japaneseWriting?: string;
  englishOverlay?: boolean;
  japaneseOpacity?: number;
  englishOpacity?: number;
  englishBlur?: boolean;
}

// Export all types individually (no default export object)
export type CompositionTypes = {
  LayoutPreset: LayoutPreset;
  GeometryPreset: GeometryPreset;
  TypographyPreset: TypographyPreset;
  MotionPreset: MotionPreset;
  MetadataPreset: MetadataPreset;
  CompositionDNA: CompositionDNA;
  Composition: Composition;
  Layer: Layer;
  CompositionContext: CompositionContext;
  Shape: Shape;
  GeometryConfig: GeometryConfig;
  CompositionPreset: CompositionPreset;
};