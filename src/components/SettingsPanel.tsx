// src/components/SettingsPanel.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  X, 
  Languages, 
  Type, 
  Sparkles, 
  Layout, 
  RefreshCw,
  Eye,
  EyeOff,
  Play,
  Layers,
  Moon,
  Sun,
  AlignLeft,
  Grid,
  ChevronDown,
} from 'lucide-react';
import { useSettings, FontStyle, LanguagePreference, AnimationSpeed, LayoutStyle, FontFamily, FontWeight, FontSize } from '../context/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Font options with Google Fonts
const fontOptions = [
  { 
    id: 'mochiy-pop', 
    label: 'Mochiy Pop',
    fontFamily: "'Mochiy Pop P One', sans-serif",
    category: 'Display'
  },
  { 
    id: 'bungee', 
    label: 'Bungee',
    fontFamily: "'Bungee', cursive",
    category: 'Display'
  },
  { 
    id: 'inter', 
    label: 'Inter',
    fontFamily: "'Inter', sans-serif",
    category: 'Sans-serif'
  },
  { 
    id: 'noto-sans-jp', 
    label: 'Noto Sans JP',
    fontFamily: "'Noto Sans JP', sans-serif",
    category: 'Sans-serif'
  },
  { 
    id: 'noto-serif-jp', 
    label: 'Noto Serif JP',
    fontFamily: "'Noto Serif JP', serif",
    category: 'Serif'
  },
  { 
    id: 'kaisei-decol', 
    label: 'Kaisei Decol',
    fontFamily: "'Kaisei Decol', serif",
    category: 'Serif'
  },
  { 
    id: 'sawarabi-mincho', 
    label: 'Sawarabi Mincho',
    fontFamily: "'Sawarabi Mincho', serif",
    category: 'Serif'
  },
  { 
    id: 'm-plus-rounded', 
    label: 'M PLUS Rounded',
    fontFamily: "'M PLUS Rounded 1c', sans-serif",
    category: 'Sans-serif'
  },
  { 
    id: 'zen-maru-gothic', 
    label: 'Zen Maru Gothic',
    fontFamily: "'Zen Maru Gothic', sans-serif",
    category: 'Sans-serif'
  },
  { 
    id: 'kiwi-maru', 
    label: 'Kiwi Maru',
    fontFamily: "'Kiwi Maru', serif",
    category: 'Serif'
  },
  { 
    id: 'yuji-mai', 
    label: 'Yuji Mai',
    fontFamily: "'Yuji Mai', serif",
    category: 'Serif'
  },
  { 
    id: 'shippori-mincho', 
    label: 'Shippori Mincho',
    fontFamily: "'Shippori Mincho', serif",
    category: 'Serif'
  },
  { 
    id: 'murecho', 
    label: 'Murecho',
    fontFamily: "'Murecho', sans-serif",
    category: 'Sans-serif'
  },
  { 
    id: 'shinbun', 
    label: 'Shinbun',
    fontFamily: "'Shinbun', serif",
    category: 'Serif'
  },
  { 
    id: 'rocknroll-one', 
    label: 'RocknRoll One',
    fontFamily: "'RocknRoll One', sans-serif",
    category: 'Display'
  },
  { 
    id: 'dotgothic', 
    label: 'DotGothic16',
    fontFamily: "'DotGothic16', sans-serif",
    category: 'Display'
  },
];

// Font weight options
const weightOptions = [
  { id: '100', label: 'Thin' },
  { id: '200', label: 'Extra Light' },
  { id: '300', label: 'Light' },
  { id: '400', label: 'Regular' },
  { id: '500', label: 'Medium' },
  { id: '600', label: 'Semi Bold' },
  { id: '700', label: 'Bold' },
  { id: '800', label: 'Extra Bold' },
  { id: '900', label: 'Black' },
];

// Font size options
const sizeOptions = [
  { id: 'xs', label: 'XS' },
  { id: 'sm', label: 'Small' },
  { id: 'base', label: 'Base' },
  { id: 'lg', label: 'Large' },
  { id: 'xl', label: 'XL' },
  { id: '2xl', label: '2XL' },
  { id: '3xl', label: '3XL' },
  { id: '4xl', label: '4XL' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'language' | 'typography' | 'animation' | 'layout'>('language');
  const [fontSearch, setFontSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center gap-2 text-secondary/60 text-[10px] tracking-[0.15em] font-light uppercase mb-2 md:mb-3">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );

  const Slider = ({ 
    label, 
    value, 
    min = 0, 
    max = 100, 
    onChange,
    suffix = '%',
    icon
  }: { 
    label: string; 
    value: number; 
    min?: number; 
    max?: number; 
    onChange: (value: number) => void;
    suffix?: string;
    icon?: React.ReactNode;
  }) => (
    <div className="mb-3 md:mb-4">
      <div className="flex justify-between items-center text-secondary/60 text-[10px] md:text-[11px] font-light mb-1">
        <div className="flex items-center gap-1.5 md:gap-2">
          {icon}
          <span className="text-xs md:text-sm">{label}</span>
        </div>
        <span className="text-xs md:text-sm">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 md:h-1 bg-primary/10 rounded-full appearance-none cursor-pointer accent-accent"
        style={{
          background: `linear-gradient(to right, #e94560 ${value}%, rgba(255,255,255,0.1) ${value}%)`,
        }}
      />
    </div>
  );

  const Toggle = ({ label, value, onChange, icon }: { label: string; value: boolean; onChange: (value: boolean) => void; icon?: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2 md:py-2.5 border-b border-primary/5 last:border-0">
      <div className="flex items-center gap-2 text-secondary/70 text-xs md:text-sm font-light">
        {icon}
        <span className="text-xs md:text-sm">{label}</span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-9 h-4.5 md:w-10 md:h-5 rounded-full transition-colors flex-shrink-0 ${
          value ? 'bg-accent' : 'bg-primary/20'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-white transition-transform shadow-sm ${
            value ? 'translate-x-4.5 md:translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const TabButton = ({ tab, label, icon }: { tab: string; label: string; icon?: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`px-2.5 md:px-3 py-1.5 text-[8px] md:text-[10px] tracking-[0.1em] font-light uppercase rounded-lg transition-all flex items-center gap-1 md:gap-1.5 whitespace-nowrap ${
        activeTab === tab
          ? 'bg-accent/20 text-accent'
          : 'text-secondary/40 hover:text-secondary/60 hover:bg-primary/5'
      }`}
    >
      {icon}
      <span className="hidden xs:inline">{label}</span>
    </button>
  );

  // Filter fonts based on search
  const filteredFonts = fontOptions.filter(font => 
    font.label.toLowerCase().includes(fontSearch.toLowerCase()) ||
    font.category.toLowerCase().includes(fontSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          className={`relative w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] bg-background border border-primary/10 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl pointer-events-auto ${
            isMobile ? 'mx-2' : ''
          }`}
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-primary/5 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 md:gap-3">
              <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
              <h2 className="text-secondary text-xs md:text-sm font-light tracking-widest uppercase">
                Preferences
              </h2>
              <span className="text-[6px] md:text-[8px] text-secondary/20 tracking-[0.1em] font-light uppercase bg-primary/5 px-1.5 md:px-2 py-0.5 rounded-full hidden sm:inline">
                v1.0
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <motion.button
                onClick={resetSettings}
                className="p-1.5 text-secondary/30 hover:text-secondary/60 transition-colors rounded-lg hover:bg-primary/5"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                title="Reset to defaults"
              >
                <RefreshCw className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </motion.button>
              <motion.button
                onClick={onClose}
                className="p-1.5 text-secondary/30 hover:text-secondary/60 transition-colors rounded-lg hover:bg-primary/5"
                whileHover={{ scale: 1.1 }}
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </motion.button>
            </div>
          </div>

          {/* Tabs - horizontal scroll on mobile */}
          <div className="px-3 md:px-6 pt-3 md:pt-4 pb-2 flex gap-1 border-b border-primary/5 overflow-x-auto scrollbar-hide">
            <TabButton tab="language" label="Language" icon={<Languages className="w-2.5 h-2.5 md:w-3 md:h-3" />} />
            <TabButton tab="typography" label="Typography" icon={<Type className="w-2.5 h-2.5 md:w-3 md:h-3" />} />
            <TabButton tab="animation" label="Animation" icon={<Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />} />
            <TabButton tab="layout" label="Layout" icon={<Layout className="w-2.5 h-2.5 md:w-3 md:h-3" />} />
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-120px)] md:max-h-[calc(90vh-160px)] p-3 md:p-6">
            {/* Language Tab */}
            {activeTab === 'language' && (
              <div>
                <Section title="Display Language" icon={<Languages className="w-3 h-3 md:w-3.5 md:h-3.5" />}>
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {(['japanese', 'english', 'bilingual'] as LanguagePreference[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => updateSettings({ languagePreference: option })}
                        className={`px-2 md:px-3 py-1.5 md:py-2 text-[8px] md:text-[10px] tracking-[0.1em] font-light uppercase rounded-lg border transition-all ${
                          settings.languagePreference === option
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-primary/10 text-secondary/40 hover:border-primary/20 hover:text-secondary/60'
                        }`}
                      >
                        {option === 'japanese' && '日本語'}
                        {option === 'english' && 'Eng'}
                        {option === 'bilingual' && 'Bi'}
                      </button>
                    ))}
                  </div>
                  
                  <Slider
                    label="English size"
                    value={settings.englishSize}
                    onChange={(value) => updateSettings({ englishSize: value })}
                    icon={<Type className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                  />
                </Section>
              </div>
            )}

            {/* Typography Tab */}
            {activeTab === 'typography' && (
              <div>
                <Section title="Font Family" icon={<Type className="w-3 h-3 md:w-3.5 md:h-3.5" />}>
                  {/* Search bar */}
                  <div className="relative mb-2 md:mb-3">
                    <input
                      type="text"
                      placeholder="Search fonts..."
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      className="w-full px-3 py-1.5 md:py-2 text-xs md:text-sm bg-primary/5 border border-primary/10 rounded-lg text-secondary/70 placeholder:text-secondary/30 focus:outline-none focus:border-accent/30 transition-colors"
                    />
                  </div>

                  {/* Font grid */}
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2 max-h-[150px] md:max-h-[200px] overflow-y-auto pr-1">
                    {filteredFonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => updateSettings({ fontFamily: font.id as FontFamily })}
                        className={`px-2 md:px-3 py-1.5 md:py-2 text-left rounded-lg border transition-all ${
                          settings.fontFamily === font.id
                            ? 'border-accent bg-accent/10'
                            : 'border-primary/10 hover:border-primary/20 hover:bg-primary/5'
                        }`}
                      >
                        <div 
                          className="text-xs md:text-sm text-secondary/80 truncate"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          {font.label}
                        </div>
                        <div className="text-[6px] md:text-[8px] text-secondary/30 tracking-[0.1em] font-light uppercase mt-0.5">
                          {font.category}
                        </div>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Font Weight" icon={<Type className="w-3 h-3 md:w-3.5 md:h-3.5" />}>
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                    {weightOptions.map((weight) => (
                      <button
                        key={weight.id}
                        onClick={() => updateSettings({ fontWeight: weight.id as FontWeight })}
                        className={`px-1.5 md:px-2 py-1 md:py-1.5 text-[8px] md:text-[10px] tracking-[0.05em] uppercase rounded-lg border transition-all ${
                          settings.fontWeight === weight.id
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-primary/10 text-secondary/40 hover:border-primary/20 hover:text-secondary/60'
                        }`}
                        style={{ fontWeight: parseInt(weight.id) }}
                      >
                        <span className="hidden xs:inline">{weight.label}</span>
                        <span className="xs:hidden">{weight.id}</span>
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Size" icon={<Type className="w-3 h-3 md:w-3.5 md:h-3.5" />}>
                  <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => updateSettings({ fontSize: size.id as FontSize })}
                        className={`px-1.5 md:px-2 py-1 md:py-1.5 text-[8px] md:text-[10px] tracking-[0.05em] uppercase rounded-lg border transition-all ${
                          settings.fontSize === size.id
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-primary/10 text-secondary/40 hover:border-primary/20 hover:text-secondary/60'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </Section>

                <Slider
                  label="Letter spacing"
                  value={settings.letterSpacing}
                  onChange={(value) => updateSettings({ letterSpacing: value })}
                  icon={<AlignLeft className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                />
                
                <Slider
                  label="Text opacity"
                  value={settings.textOpacity}
                  onChange={(value) => updateSettings({ textOpacity: value })}
                  icon={<Eye className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                />
              </div>
            )}

            {/* Animation Tab */}
            {activeTab === 'animation' && (
              <div>
                <Section title="Motion" icon={<Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" />}>
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2 mb-3 md:mb-4">
                    {(['slow', 'normal', 'fast'] as AnimationSpeed[]).map((speed) => (
                      <button
                        key={speed}
                        onClick={() => updateSettings({ animationSpeed: speed })}
                        className={`px-2 md:px-3 py-1.5 md:py-2 text-[8px] md:text-[10px] tracking-[0.1em] font-light uppercase rounded-lg border transition-all ${
                          settings.animationSpeed === speed
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-primary/10 text-secondary/40 hover:border-primary/20 hover:text-secondary/60'
                        }`}
                      >
                        {speed === 'slow' && 'Slow'}
                        {speed === 'normal' && 'Norm'}
                        {speed === 'fast' && 'Fast'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-0.5 md:space-y-1">
                    <Toggle
                      label="Enable animations"
                      value={settings.enableAnimations}
                      onChange={(value) => updateSettings({ enableAnimations: value })}
                      icon={<Play className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                    />
                    
                    <Toggle
                      label="Enable breathing effect"
                      value={settings.enableBreathing}
                      onChange={(value) => updateSettings({ enableBreathing: value })}
                      icon={<Moon className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                    />
                  </div>
                </Section>
              </div>
            )}

            {/* Layout Tab */}
            {activeTab === 'layout' && (
              <div>
                <Section title="Display" icon={<Layout className="w-3 h-3 md:w-3.5 md:h-3.5" />}>
                  <div className="space-y-0.5 md:space-y-1">
                    <Toggle
                      label="Show metadata"
                      value={settings.showMetadata}
                      onChange={(value) => updateSettings({ showMetadata: value })}
                      icon={<Layers className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                    />
                    
                    <Toggle
                      label="Show background"
                      value={settings.showBackground}
                      onChange={(value) => updateSettings({ showBackground: value })}
                      icon={<Grid className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                    />
                    
                    <Toggle
                      label="Enable glow effects"
                      value={settings.enableGlow}
                      onChange={(value) => updateSettings({ enableGlow: value })}
                      icon={<Sun className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                    />
                    
                    <Toggle
                      label="Enable particles"
                      value={settings.enableParticles}
                      onChange={(value) => updateSettings({ enableParticles: value })}
                      icon={<Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary/40" />}
                    />
                  </div>
                </Section>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-primary/5 px-3 md:px-6 py-2 md:py-3 flex flex-col xs:flex-row justify-between items-center gap-1 xs:gap-0 text-[6px] md:text-[8px] text-secondary/30 tracking-[0.1em] font-light uppercase">
            <span>Settings saved automatically</span>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-accent/30" />
              <span className="text-[5px] md:text-[8px]">Stored locally</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsPanel;