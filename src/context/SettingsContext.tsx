// src/context/SettingsContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontStyle = 'elegant' | 'bold' | 'delicate' | 'dramatic' | 'minimal';
export type LanguagePreference = 'japanese' | 'english' | 'bilingual';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';
export type LayoutStyle = 'editorial' | 'minimal' | 'dramatic' | 'balanced';

// Font family types for Google Fonts
export type FontFamily = 
  | 'mochiy-pop'
  | 'bungee'
  | 'inter'
  | 'noto-sans-jp'
  | 'noto-serif-jp'
  | 'kaisei-decol'
  | 'sawarabi-mincho'
  | 'm-plus-rounded'
  | 'zen-maru-gothic'
  | 'kiwi-maru'
  | 'yuji-mai'
  | 'shippori-mincho'
  | 'murecho'
  | 'shinbun'
  | 'rocknroll-one'
  | 'dotgothic';

export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// Font mapping to Google Fonts CSS
export const fontMap: Record<FontFamily, string> = {
  'mochiy-pop': "'Mochiy Pop P One', sans-serif",
  'bungee': "'Bungee', cursive",
  'inter': "'Inter', sans-serif",
  'noto-sans-jp': "'Noto Sans JP', sans-serif",
  'noto-serif-jp': "'Noto Serif JP', serif",
  'kaisei-decol': "'Kaisei Decol', serif",
  'sawarabi-mincho': "'Sawarabi Mincho', serif",
  'm-plus-rounded': "'M PLUS Rounded 1c', sans-serif",
  'zen-maru-gothic': "'Zen Maru Gothic', sans-serif",
  'kiwi-maru': "'Kiwi Maru', serif",
  'yuji-mai': "'Yuji Mai', serif",
  'shippori-mincho': "'Shippori Mincho', serif",
  'murecho': "'Murecho', sans-serif",
  'shinbun': "'Shinbun', serif",
  'rocknroll-one': "'RocknRoll One', sans-serif",
  'dotgothic': "'DotGothic16', sans-serif",
};

// Font size to Tailwind classes
export const fontSizeMap: Record<FontSize, string> = {
  'xs': 'text-xs',
  'sm': 'text-sm',
  'base': 'text-base',
  'lg': 'text-lg',
  'xl': 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

interface Settings {
  // Language & Display
  languagePreference: LanguagePreference;
  showEnglishFirst: boolean;
  englishSize: number; // 0-100, where 100 is equal to Japanese
  
  // Typography
  fontStyle: FontStyle;
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  fontSize: FontSize;
  letterSpacing: number; // 0-100
  textOpacity: number; // 0-100
  
  // Animation
  animationSpeed: AnimationSpeed;
  enableAnimations: boolean;
  enableParallax: boolean;
  
  // Layout
  layoutStyle: LayoutStyle;
  showMetadata: boolean;
  showBackground: boolean;
  
  // Effects
  enableGlow: boolean;
  enableParticles: boolean;
  enableBreathing: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  getFontFamily: () => string;
  getFontWeight: () => number;
  getFontSize: () => string;
}

const defaultSettings: Settings = {
  languagePreference: 'bilingual',
  showEnglishFirst: false,
  englishSize: 60,
  
  fontStyle: 'elegant',
  fontFamily: 'mochiy-pop',
  fontWeight: '400',
  fontSize: 'base',
  letterSpacing: 50,
  textOpacity: 90,
  
  animationSpeed: 'normal',
  enableAnimations: true,
  enableParallax: true,
  
  layoutStyle: 'editorial',
  showMetadata: true,
  showBackground: true,
  
  enableGlow: true,
  enableParticles: true,
  enableBreathing: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('poster-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all properties exist
        return { ...defaultSettings, ...parsed };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('poster-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const getFontFamily = () => {
    return fontMap[settings.fontFamily] || fontMap['mochiy-pop'];
  };

  const getFontWeight = () => {
    return parseInt(settings.fontWeight) || 400;
  };

  const getFontSize = () => {
    return fontSizeMap[settings.fontSize] || 'text-base';
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      resetSettings,
      getFontFamily,
      getFontWeight,
      getFontSize
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};