export type AnimationPreset = 
  | 'fade'
  | 'slideLeft'
  | 'slideRight'
  | 'verticalReveal'
  | 'characterStagger'
  | 'wordHighlight'
  | 'blurResolve'
  | 'trackingExpansion'
  | 'splitLayout'
  | 'giantBackground'
  | 'cropReveal'
  | 'maskReveal';

export type LayoutType = 
  | 'stack'
  | 'split'
  | 'corner'
  | 'overlay'
  | 'vertical'
  | 'horizontal';

export type ViewMode = 'original' | 'bilingual' | 'translation';

export interface LyricLine {
  start: number;
  end: number;
  japanese: string;
  english: string;
  animation: AnimationPreset;
  layout: LayoutType;
  emphasis?: {
    japanese?: number[];
    english?: number[];
  };
  scale?: 'small' | 'medium' | 'large';
  backgroundWord?: string;
}