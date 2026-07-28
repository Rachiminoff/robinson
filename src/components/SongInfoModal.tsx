import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Music, User, Mic, Clock, Disc, Tag, Award, Info, Heart, Zap } from 'lucide-react';

interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SongInfo {
  title: string;
  japaneseTitle: string;
  artist: string;
  album: string;
  year: string;
  released: string;
  track: string;
  duration: string;
  label: string;
  writers: string;
  producers: string;
  recorded: string;
  genre: string[];
  bpm: string;
  description: string;
  trivia: string;
  sales: string;
  awards?: string[];
  chartPositions?: string[];
}

const songInfo: SongInfo = {
  title: 'Robinson',
  japaneseTitle: 'ロビンソン',
  artist: 'Spitz',
  album: 'Hachimitsu (Honey)',
  year: '1995',
  released: 'April 5, 1995',
  track: '11th Single',
  duration: '4:29',
  label: 'Polydor Records',
  writers: 'Masamune Kusano',
  producers: 'Spitz',
  recorded: '1995',
  genre: ['Soft rock', 'Pop rock', 'Alternative rock'],
  bpm: '120',
  description: '"Robinson" (ロビンソン) is a song by the Japanese rock band Spitz, released on April 5, 1995 as their 11th single. It later appeared on their sixth studio album, Hachimitsu (Honey). The song became the band\'s commercial breakthrough and remains their signature work over 30 years later.',
  trivia: 'One of the song\'s most famous pieces of trivia is that the title has almost nothing to do with the lyrics. According to songwriter Masamune Kusano, "Robinson" was originally just a working title inspired by seeing a Robinson Department Store while traveling in Thailand. The temporary title simply stuck and became the final title, even though the word "Robinson" never appears in the lyrics.',
  sales: 'Over 1.6 million copies sold',
  awards: [
    'Best-selling single of Spitz\'s career',
    'Widely regarded as one of the defining Japanese rock songs of the 1990s',
    'Helped establish Spitz as one of Japan\'s most successful rock bands',
  ],
  chartPositions: [
    'Oricon Weekly Singles Chart - Peak Position #2',
    'Oricon Year-end Chart (1995) - #18',
    'Oricon All-time Singles Chart - #89',
  ],
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
              {/* Close button - floating */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-accent/20 transition-colors text-secondary/60 hover:text-secondary"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <X className="w-4 h-4" />
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
                      <span className="bg-accent/10 px-3 py-1 rounded-full">Single • 1995</span>
                    </motion.div>
                    
                    {/* Title with Japanese */}
                    <div className="flex flex-col gap-1">
                      <motion.h1 
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                        style={{ fontFamily: "'Bungee', cursive" }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-gradient-red">ROBINSON</span>
                      </motion.h1>
                      <motion.div 
                        className="text-secondary/40 text-sm font-light tracking-wide"
                        style={{ fontFamily: "'Mochiy Pop P One', sans-serif" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                      >
                        {songInfo.japaneseTitle}
                      </motion.div>
                    </div>
                    
                    {/* Artist */}
                    <motion.div 
                      className="flex items-center gap-3 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-secondary/60 text-sm font-light">by</span>
                      <span className="text-secondary text-sm font-medium tracking-wide">{songInfo.artist}</span>
                      <span className="w-1 h-1 rounded-full bg-secondary/20" />
                      <span className="text-secondary/40 text-xs tracking-widest font-light">JPN</span>
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
                      {songInfo.description}
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
                          1.6M+
                        </div>
                        <div className="text-secondary/40 text-[10px] tracking-[0.1em] font-light uppercase">Copies Sold</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-primary/80" style={{ fontFamily: "'Bungee', cursive" }}>
                          #2
                        </div>
                        <div className="text-secondary/40 text-[10px] tracking-[0.1em] font-light uppercase">Oricon Chart Peak</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-primary/80" style={{ fontFamily: "'Bungee', cursive" }}>
                          1995
                        </div>
                        <div className="text-secondary/40 text-[10px] tracking-[0.1em] font-light uppercase">Defining Song of the 90s</div>
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
                      { icon: Music, label: 'Genre', value: songInfo.genre.join(' • ') },
                      { icon: Calendar, label: 'Released', value: songInfo.released },
                      { icon: Disc, label: 'Album', value: songInfo.album },
                      { icon: Clock, label: 'Length', value: songInfo.duration },
                      { icon: User, label: 'Lyrics & Music', value: songInfo.writers },
                      { icon: Mic, label: 'Producer(s)', value: songInfo.producers },
                      { icon: Tag, label: 'Label', value: songInfo.label },
                      { icon: Award, label: 'Certification', value: 'Million (1.6M+)' },
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

                  {/* Trivia Section - Why is it called Robinson? */}
                  <motion.div
                    className="mb-8 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h2 className="text-[10px] text-amber-400/60 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-amber-400/60" />
                      Why is it called "Robinson"?
                    </h2>
                    <p className="text-secondary/60 text-sm leading-relaxed font-light">
                      {songInfo.trivia}
                    </p>
                  </motion.div>

                  {/* Awards Section */}
                  {songInfo.awards && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5" />
                        Legacy & Recognition
                      </h2>
                      <div className="space-y-2">
                        {songInfo.awards.map((award, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 text-secondary/60 text-sm font-light pl-4 border-l-2 border-accent/30"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <span className="text-accent/40">▸</span>
                            {award}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Chart Positions */}
                  {songInfo.chartPositions && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <h2 className="text-[10px] text-secondary/40 tracking-[0.2em] font-light uppercase mb-3 flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Chart Performance
                      </h2>
                      <div className="space-y-2">
                        {songInfo.chartPositions.map((position, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 text-secondary/60 text-sm font-light pl-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 + index * 0.1 }}
                          >
                            <span className="text-accent/30 text-xs">#{index + 1}</span>
                            {position}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Footer */}
                  <motion.div
                    className="mt-8 pt-4 border-t border-primary/5 flex items-center justify-between text-[8px] text-secondary/30 tracking-[0.15em] font-light uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <span>© 1995 Polydor Records</span>
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