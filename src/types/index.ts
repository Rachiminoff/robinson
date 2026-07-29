// src/types/index.ts

export interface LyricLine {
  start: number;
  end: number;
  japanese: string;
  english: string;
  backgroundWord?: string;
}

export type ViewMode = 'original' | 'bilingual' | 'translation';

export interface TrackInfo {
  artist: string;
  title: string;
  year: string;
  track: string;
  duration: string;
  label: string;
}

// Export composition types
export * from './composition';