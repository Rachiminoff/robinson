import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Music, User, Mic, Clock, Disc, Tag, Award, Info, Heart, Zap } from 'lucide-react';
import metadataData from '../data/metadata.json';

interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interface matching the exact JSON structure
interface SongMetadata {
  artist: string;
  artistCountry: string;
  title: string;
  year: number;
  trackNumber: string;
  duration: number;
  label: string;
  producers: string[];
  writers: string[];
  genres: string[];
  bpm: number;
  key: string;
  mood: string[];
  description: string;
  album: {
    title: string;
    releaseDate: string;
    trackNumber: number;
  };
  single: {
    releaseDate: string;
    catalogNumber: string;
    format: string;
  };
  charts: {
    oricon: {
      peak: number;
      weeksOnChart: number;
    };
  };
  sales: {
    copiesSold: number;
    certification: string;
  };
  credits: {
    lyrics: string;
    composition: string;
    arrangement: string[];
    producer: string[];
  };
}

// Use the data directly
const songData: SongMetadata = metadataData as SongMetadata;

// Format duration from seconds to mm:ss
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format number with commas
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Custom scrollbar styles
const scrollbarStyles = `
  .modal-scroll::-webkit-scrollbar {
    width: 6px;
  }
  
  .modal-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
    margin: 8px 0;
  }
  
  .modal-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(233, 69, 96, 0.4), rgba(233, 69, 96, 0.2));
    border-radius: 10px;
    border: 1px solid rgba(233, 69, 96, 0.1);
    transition: all 0.3s ease;
  }
  
  .modal-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(233, 69, 96, 0.6), rgba(233, 69, 96, 0.3));
    border-color: rgba(233, 69, 96, 0.2);
  }
  
  .modal-scroll::-webkit-scrollbar-thumb:active {
    background: linear-gradient(180deg, rgba(233, 69, 96, 0.8), rgba(233, 69, 96, 0.4));
  }
  
  /* Firefox scrollbar */
  .modal-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(233, 69, 96, 0.3) rgba(255, 255, 255, 0.02);
  }
  
  /* Edge/Internet Explorer scrollbar */
  .modal-scroll {
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }

  /* Scroll indicator gradient at bottom */
  .modal-scroll-gradient {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(0deg, rgba(17, 17, 17, 0.95) 0%, transparent 100%);
    pointer-events: none;
    z-index: 5;
  }
`;

const SongInfoModal: React.FC<SongInfoModalProps> = ({ isOpen, onClose }) => {
  // Keyboard escape handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Inject scrollbar styles */}
      <style>{scrollbarStyles}</style>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Modal */}
            <motion.div
              className="relative w-full max-w-2xl bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]"
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* X Close button - floating top right with higher z-index */}
              <motion.button
                onClick={onClose}
                className="absolute top-3 right-3 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-accent/30 hover:border-accent/30 transition-all duration-200 text-white/60 hover:text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Scrollable content with custom scrollbar */}
              <div className="modal-scroll max-h-[90vh] overflow-y-auto relative">
                {/* Hero Section */}
                <div className="relative px-8 pt-8 pb-6 border-b border-primary/5 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-blue-500/5" />
                  
                  <div className="relative">
                    {/* Type label */}
                    <motion.div 
                      className="text-[10px] text-secondary/40 tracking-[0.3em] font-light uppercase mb-3"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <span className="bg-accent/10 px-3 py-1 rounded-full">Single • {songData.year}</span>
                    </motion.div>
                    
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                      <motion.h1 
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                        style={{ fontFamily: "'Bungee', cursive" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-gradient-red">{songData.title}</span>
                      </motion.h1>
                    </div>
                    
                    {/* Artist */}
                    <motion.div 
                      className="flex items-center gap-3 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-secondary/60 text-sm font-light">by</span>
                      <span className="text-secondary text-sm font-medium tracking-wide">{songData.artist}</span>
                      <span className="w-1 h-1 rounded-full bg-secondary/20" />
                      <span className="text-secondary/40 text-xs tracking-widest font-light">{songData.artistCountry}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6 pb-20">
                  {/* Description */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" />
                      About
                    </h2>
                    <p className="text-secondary/70 text-sm leading-relaxed font-light">
                      {songData.description}
                    </p>
                  </motion.div>

                  {/* Commercial Success */}
                  <motion.div
                    className="mb-8 p-4 bg-accent/5 rounded-xl border border-accent/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-accent/60" />
                      Commercial Success
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-accent" style={{ fontFamily: "'Bungee', cursive" }}>
                          {songData.sales.certification}
                        </div>
                        <div className="text-secondary/40 text-[10px] tracking-[0.1em] font-light uppercase">Certification</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-primary/80" style={{ fontFamily: "'Bungee', cursive" }}>
                          #{songData.charts.oricon.peak}
                        </div>
                        <div className="text-secondary/40 text-[10px] tracking-[0.1em] font-light uppercase">Oricon Chart Peak</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-primary/80" style={{ fontFamily: "'Bungee', cursive" }}>
                          {songData.charts.oricon.weeksOnChart}
                        </div>
                        <div className="text-secondary/40 text-[10px] tracking-[0.1em] font-light uppercase">Weeks on Chart</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Info Grid - Wikipedia style */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8 p-4 bg-primary/5 rounded-xl border border-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {[
                      { icon: Music, label: 'Genre', value: songData.genres.join(' • ') },
                      { icon: Calendar, label: 'Released', value: songData.single.releaseDate },
                      { icon: Disc, label: 'Album', value: songData.album.title },
                      { icon: Clock, label: 'Length', value: formatDuration(songData.duration) },
                      { icon: User, label: 'Writers', value: songData.writers.join(', ') },
                      { icon: Mic, label: 'Producer(s)', value: songData.producers.join(', ') },
                      { icon: Tag, label: 'Label', value: songData.label },
                      { icon: Award, label: 'Certification', value: songData.sales.certification },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.04 }}
                      >
                        <item.icon className="w-3.5 h-3.5 text-secondary/30 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-[8px] text-secondary/40 tracking-[0.15em] font-light uppercase">
                            {item.label}
                          </div>
                          <div className="text-[12px] text-primary/80 font-light mt-0.5">
                            {item.value}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Credits Section */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5" />
                      Credits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[8px] text-secondary/40 tracking-[0.1em] font-light uppercase">Lyrics</div>
                        <div className="text-[12px] text-primary/70 font-light mt-0.5">{songData.credits.lyrics}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-secondary/40 tracking-[0.1em] font-light uppercase">Composition</div>
                        <div className="text-[12px] text-primary/70 font-light mt-0.5">{songData.credits.composition}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-secondary/40 tracking-[0.1em] font-light uppercase">Arrangement</div>
                        <div className="text-[12px] text-primary/70 font-light mt-0.5">{songData.credits.arrangement.join(', ')}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-secondary/40 tracking-[0.1em] font-light uppercase">Producers</div>
                        <div className="text-[12px] text-primary/70 font-light mt-0.5">{songData.credits.producer.join(', ')}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mood */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-2 flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5" />
                      Mood
                    </h2>
                    <p className="text-secondary/60 text-sm font-light">{songData.mood.join(' • ')}</p>
                  </motion.div>

                  {/* Technical Info */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <div className="text-[8px] text-secondary/40 tracking-[0.1em] font-light uppercase">BPM</div>
                      <div className="text-[12px] text-primary/70 font-light mt-0.5">{songData.bpm}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-secondary/40 tracking-[0.1em] font-light uppercase">Key</div>
                      <div className="text-[12px] text-primary/70 font-light mt-0.5">{songData.key}</div>
                    </div>
                  </div>

                  {/* Sales */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5" />
                      Sales
                    </h2>
                    <div className="flex items-center gap-3 text-secondary/60 text-sm font-light pl-4 border-l-2 border-accent/30">
                      <span className="text-accent/40">▸</span>
                      {formatNumber(songData.sales.copiesSold)} copies sold
                    </div>
                  </motion.div>

                  {/* Single Info */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                      <Disc className="w-3.5 h-3.5" />
                      Single Details
                    </h2>
                    <div className="space-y-1 text-secondary/60 text-sm font-light pl-4 border-l-2 border-accent/30">
                      <div>
                        <span className="text-accent/40">▸</span> Catalog: {songData.single.catalogNumber}
                      </div>
                      <div>
                        <span className="text-accent/40">▸</span> Format: {songData.single.format}
                      </div>
                    </div>
                  </motion.div>

                  {/* Footer */}
                  <motion.div
                    className="mt-8 pt-4 border-t border-primary/5 flex items-center justify-between text-[8px] text-secondary/30 tracking-[0.15em] font-light uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <span>© {songData.year} {songData.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent/30" />
                      <span>All Rights Reserved</span>
                    </div>
                  </motion.div>
                </div>

                {/* Scroll indicator gradient at bottom */}
                <div className="modal-scroll-gradient" />
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent/20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent/20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent/20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent/20 pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SongInfoModal;