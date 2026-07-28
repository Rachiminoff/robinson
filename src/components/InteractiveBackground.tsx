import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useMouseTracking } from '../hooks/useMouseTracking';

interface InteractiveBackgroundProps {
  showGrid?: boolean;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ showGrid = false }) => {
  const mouse = useMouseTracking();
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickCount, setClickCount] = useState<number>(0);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showClickIndicator, setShowClickIndicator] = useState<boolean>(false);

  // Handle triple click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[role="button"]')) {
        return;
      }

      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }

      setClickCount(prev => {
        const newCount = prev + 1;
        setShowClickIndicator(true);

        if (newCount >= 3) {
          setIsInverted(prev => !prev);
          setShowClickIndicator(false);
          if (navigator.vibrate) {
            navigator.vibrate(20);
          }
          return 0;
        }

        clickTimerRef.current = setTimeout(() => {
          setClickCount(0);
          setShowClickIndicator(false);
        }, 600);

        return newCount;
      });
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Calculate interactive offsets
  const offsetX = (mouse.normalizedX - 0.5) * 40;
  const offsetY = (mouse.normalizedY - 0.5) * 40;
  const rotateX = (mouse.normalizedY - 0.5) * 3;
  const rotateY = (mouse.normalizedX - 0.5) * -3;
  const velocity = mouse.velocity;

  // Background colors
  const bgColor = isInverted ? '#F5F5F5' : '#111111';
  const borderColor = isInverted ? 'rgba(17,17,17,0.1)' : 'rgba(245,245,245,0.1)';
  const borderColorLight = isInverted ? 'rgba(17,17,17,0.05)' : 'rgba(245,245,245,0.05)';

  // Invert key for forcing re-render
  const invertKey = isInverted ? 'inverted' : 'normal';

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ 
        background: bgColor,
        transition: 'background 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Triple click indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {showClickIndicator && clickCount > 0 && (
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-lg"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  i < clickCount ? 'bg-accent' : 'bg-primary/20'
                }`}
                animate={{
                  scale: i < clickCount ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  repeat: i < clickCount ? 1 : 0,
                }}
              />
            ))}
            <span className="text-[8px] text-secondary/40 ml-1 font-light tracking-wider">
              {3 - clickCount} more {3 - clickCount === 1 ? 'click' : 'clicks'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Base background gradient */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        animate={{
          background: isInverted ? [
            'radial-gradient(circle at 20% 50%, rgba(139,47,58,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(52,152,219,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(241,196,15,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(139,47,58,0.05) 0%, transparent 50%)',
          ] : [
            'radial-gradient(circle at 20% 50%, rgba(139,47,58,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(52,152,219,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(241,196,15,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(139,47,58,0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Interactive shapes group */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: offsetX * 0.15,
          y: offsetY * 0.15,
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 60 }}
      >
        {/* 1. Large diagonal rectangle */}
        <motion.div
          key={`rect-${invertKey}`}
          className="absolute top-[5%] left-[-5%] w-80 h-96 rotate-[35deg]"
          animate={{
            x: mouse.normalizedX * 25 - 12.5,
            y: mouse.normalizedY * 25 - 12.5,
            rotate: [35, 38, 35],
            opacity: [0.08, 0.2, 0.08],
            backgroundColor: isInverted ? '#E94560' : '#8B2F3A',
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 60,
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 12, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 0.6, ease: "easeInOut" }
          }}
        />
        
        {/* 2. Large circle */}
        <motion.div
          key={`circle-${invertKey}`}
          className="absolute bottom-[10%] right-[-8%] w-96 h-96 rounded-full"
          animate={{
            x: (mouse.normalizedX - 0.5) * -35,
            y: (mouse.normalizedY - 0.5) * -35,
            scale: 1 + Math.abs(mouse.normalizedX - 0.5) * 0.05,
            opacity: [0.06, 0.15, 0.06],
            backgroundColor: isInverted ? '#6DD5FA' : '#2563EB',
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 50,
            opacity: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 },
            backgroundColor: { duration: 0.6, ease: "easeInOut", delay: 0.1 }
          }}
        />
        
        {/* 3. Triangle */}
        <motion.div
          key={`triangle-${invertKey}`}
          className="absolute top-[15%] right-[10%] w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[121px]"
          animate={{
            x: mouse.normalizedX * 30 - 15,
            y: mouse.normalizedY * 30 - 15,
            rotate: mouse.normalizedX * 10,
            opacity: [0.06, 0.15, 0.06],
            borderBottomColor: isInverted ? '#FDE68A' : '#F59E0B',
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 40,
            opacity: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 },
            borderBottomColor: { duration: 0.6, ease: "easeInOut", delay: 0.2 }
          }}
        />
        
        {/* 4. Square */}
        <motion.div
          key={`square-${invertKey}`}
          className="absolute top-[45%] left-[5%] w-24 h-24 rotate-12"
          animate={{
            x: (mouse.normalizedX - 0.5) * -45,
            y: (mouse.normalizedY - 0.5) * -45,
            rotate: 12 + (mouse.normalizedX - 0.5) * 15,
            scale: 1 + Math.abs(mouse.normalizedY - 0.5) * 0.08,
            opacity: [0.08, 0.2, 0.08],
            backgroundColor: isInverted ? '#FF6B8A' : '#DC2626',
          }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 70,
            opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            backgroundColor: { duration: 0.6, ease: "easeInOut", delay: 0.3 }
          }}
        />
        
        {/* 5. Diamond */}
        <motion.div
          key={`diamond-${invertKey}`}
          className="absolute bottom-[35%] right-[10%] w-20 h-20 rotate-45"
          animate={{
            x: mouse.normalizedX * 40 - 20,
            y: (mouse.normalizedY - 0.5) * -40,
            scale: 1 + (mouse.normalizedX - 0.5) * 0.15,
            rotate: 45 + (mouse.normalizedX - 0.5) * 10,
            opacity: [0.06, 0.18, 0.06],
            backgroundColor: isInverted ? '#87CEEB' : '#1E3A8A',
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 55,
            opacity: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            backgroundColor: { duration: 0.6, ease: "easeInOut", delay: 0.4 }
          }}
        />
        
        {/* 6. Small Circle */}
        <motion.div
          key={`small-circle-${invertKey}`}
          className="absolute top-[60%] left-[15%] w-16 h-16 rounded-full"
          animate={{
            x: (mouse.normalizedX - 0.5) * -30,
            y: (mouse.normalizedY - 0.5) * -30,
            scale: 1 + Math.abs(mouse.normalizedX - 0.5) * 0.1,
            opacity: [0.05, 0.15, 0.05],
            backgroundColor: isInverted ? '#FCD34D' : '#F59E0B',
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 45,
            opacity: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
            backgroundColor: { duration: 0.6, ease: "easeInOut", delay: 0.5 }
          }}
        />
        
        {/* 7. Concentric circles */}
        <motion.div
          key={`concentric-${invertKey}`}
          className="absolute top-[40%] right-[3%]"
          animate={{
            x: (mouse.normalizedX - 0.5) * -55,
            y: (mouse.normalizedY - 0.5) * -55,
            scale: 1 + Math.abs(mouse.normalizedX - 0.5) * 0.05,
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 45,
            opacity: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }}
        >
          {[20, 14, 10, 6, 2].map((size, i) => (
            <motion.div
              key={`ring-${i}-${invertKey}`}
              className="rounded-full border"
              style={{
                width: size,
                height: size,
                marginTop: i > 0 ? -size - 3 : 0,
                marginLeft: i > 0 ? 3 : 0,
                borderColor: isInverted ? 
                  `rgba(245, 158, 11, ${0.2 + i * 0.05})` :
                  `rgba(245, 158, 11, ${0.15 + i * 0.05})`,
              }}
              animate={{
                scale: [1, 1 + (i + 1) * 0.02, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
        
        {/* 8. Hexagon */}
        <motion.div
          key={`hexagon-${invertKey}`}
          className="absolute bottom-[45%] left-[40%] w-24 h-24"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
          }}
          animate={{
            x: mouse.normalizedX * 35 - 17.5,
            y: mouse.normalizedY * 35 - 17.5,
            rotate: mouse.normalizedX * 25,
            scale: 1 + Math.abs(mouse.normalizedY - 0.5) * 0.08,
            opacity: [0.04, 0.12, 0.04],
            backgroundColor: isInverted ? '#C4B5FD' : '#8B5CF6',
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 65,
            opacity: { duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            backgroundColor: { duration: 0.6, ease: "easeInOut", delay: 0.6 }
          }}
        />
        
        {/* 9. Colorful squares grid */}
        <motion.div
          key={`grid-${invertKey}`}
          className="absolute top-[55%] left-[72%] grid grid-cols-3 gap-1.5"
          animate={{
            x: (mouse.normalizedX - 0.5) * -45,
            y: (mouse.normalizedY - 0.5) * -45,
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 50,
            opacity: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.7 }
          }}
        >
          {[...Array(9)].map((_, i) => {
            const colors = isInverted ? 
              ['#FDA4AF', '#FDE68A', '#6EE7B7', '#93C5FD', '#C4B5FD', '#FDA4AF', '#FDE68A', '#6EE7B7', '#93C5FD'] :
              ['#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F43F5E', '#F59E0B', '#10B981', '#3B82F6'];
            return (
              <motion.div
                key={`grid-${i}-${invertKey}`}
                className="w-4 h-4"
                style={{ 
                  background: colors[i],
                  opacity: isInverted ? 0.4 : 0.25,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: isInverted ? [0.4, 0.6, 0.4] : [0.25, 0.4, 0.25],
                }}
                transition={{
                  duration: 2 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            );
          })}
        </motion.div>
        
        {/* 10. Dot pattern */}
        <motion.div
          key={`dots-${invertKey}`}
          className="absolute bottom-[30%] left-[22%] grid grid-cols-4 gap-2.5"
          animate={{
            x: mouse.normalizedX * 25 - 12.5,
            y: mouse.normalizedY * 25 - 12.5,
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 80,
            opacity: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }}
        >
          {[...Array(16)].map((_, i) => {
            const colors = isInverted ?
              ['#E94560', '#6DD5FA', '#FDE68A', '#6EE7B7', '#C4B5FD', '#FDA4AF', '#A5B4FC', '#5EEAD4'] :
              ['#8B2F3A', '#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#F43F5E', '#6366F1', '#14B8A6'];
            return (
              <motion.div
                key={`dot-${i}-${invertKey}`}
                className="w-2 h-2 rounded-full"
                style={{
                  background: colors[i % 8],
                  opacity: isInverted ? 0.6 : 0.4,
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: isInverted ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 1.5 + (i % 3) * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.06,
                }}
              />
            );
          })}
        </motion.div>
        
        {/* 11. Diagonal lines */}
        <motion.div
          key={`diaglines-${invertKey}`}
          className="absolute top-[18%] right-[25%] flex flex-col gap-4"
          animate={{
            x: mouse.normalizedX * 10 - 5,
            y: mouse.normalizedY * 10 - 5,
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 50,
            opacity: { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.2 }
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`diag-${i}-${invertKey}`}
              className="h-px rotate-45 origin-right"
              style={{ 
                backgroundColor: isInverted ? 
                  `rgba(233, 69, 96, ${0.15 - i * 0.03})` :
                  `rgba(244, 63, 94, ${0.15 - i * 0.03})`
              }}
              animate={{
                width: ['6rem', `${8 - i * 0.5}rem`, '6rem'],
              }}
              transition={{
                width: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
              }}
            />
          ))}
        </motion.div>
        
        {/* 12. Triangle cluster */}
        <motion.div
          key={`triangles-${invertKey}`}
          className="absolute bottom-[20%] right-[30%] flex gap-2"
          animate={{
            x: mouse.normalizedX * 15 - 7.5,
            y: mouse.normalizedY * 15 - 7.5,
            opacity: [0.04, 0.1, 0.04],
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 55,
            opacity: { duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
          }}
        >
          {[
            isInverted ? '#E94560' : '#8B2F3A',
            isInverted ? '#6DD5FA' : '#2563EB',
            isInverted ? '#FDE68A' : '#F59E0B'
          ].map((color, i) => (
            <motion.div
              key={`tricluster-${i}-${invertKey}`}
              className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px]"
              style={{ borderBottomColor: color }}
              animate={{
                y: [0, -4 - i * 2, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                opacity: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
              }}
            />
          ))}
        </motion.div>
        
        {/* 13. Large vertical bar */}
        <motion.div
          key={`vbar-${invertKey}`}
          className="absolute top-[10%] left-[55%] w-2 rounded-full"
          animate={{
            x: mouse.normalizedX * 10 - 5,
            y: mouse.normalizedY * 10 - 5,
            height: ['12rem', '16rem', '12rem'],
            opacity: [0.04, 0.12, 0.04],
            backgroundColor: isInverted ? '#A5B4FC' : '#6366F1',
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 60,
            height: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            opacity: { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
            backgroundColor: { duration: 0.6, ease: "easeInOut", delay: 0.7 }
          }}
        />
        
        {/* 14. Rectangle with border */}
        <motion.div
          key={`rectborder-${invertKey}`}
          className="absolute top-[30%] right-[5%] w-32 h-20 border-2"
          animate={{
            x: (mouse.normalizedX - 0.5) * -20,
            y: (mouse.normalizedY - 0.5) * -20,
            rotate: mouse.normalizedX * 5,
            scale: 1 + Math.abs(mouse.normalizedX - 0.5) * 0.05,
            opacity: [0.04, 0.1, 0.04],
            borderColor: isInverted ? '#5EEAD4' : '#14B8A6',
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 55,
            opacity: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2.8 },
            borderColor: { duration: 0.6, ease: "easeInOut", delay: 0.8 }
          }}
        />
        
        {/* 15. Small triangle */}
        <motion.div
          key={`smalltri-${invertKey}`}
          className="absolute top-[80%] left-[35%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px]"
          animate={{
            x: mouse.normalizedX * 15 - 7.5,
            y: mouse.normalizedY * 15 - 7.5,
            rotate: mouse.normalizedX * 8,
            opacity: [0.04, 0.1, 0.04],
            borderBottomColor: isInverted ? '#FDA4AF' : '#F43F5E',
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 45,
            opacity: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 },
            borderBottomColor: { duration: 0.6, ease: "easeInOut", delay: 0.9 }
          }}
        />
        
        {/* 16. Circle with dots */}
        <motion.div
          key={`circledots-${invertKey}`}
          className="absolute top-[5%] left-[40%]"
          animate={{
            x: mouse.normalizedX * 20 - 10,
            y: mouse.normalizedY * 20 - 10,
            opacity: [0.03, 0.07, 0.03],
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 50,
            opacity: { duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }}
        >
          <motion.div 
            className="w-48 h-48 rounded-full border"
            style={{ borderColor: borderColor }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/10" />
          {[
            { top: '10%', left: '10%', color: isInverted ? '#FDA4AF' : '#F43F5E' },
            { bottom: '15%', right: '15%', color: isInverted ? '#6DD5FA' : '#2563EB' },
            { top: '20%', right: '20%', color: isInverted ? '#FDE68A' : '#F59E0B' },
            { bottom: '25%', left: '25%', color: isInverted ? '#6EE7B7' : '#10B981' },
          ].map((dot, i) => (
            <motion.div
              key={`dotcircle-${i}-${invertKey}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                top: dot.top,
                left: dot.left,
                right: dot.right,
                bottom: dot.bottom,
                background: dot.color,
                opacity: isInverted ? 0.3 : 0.15,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: isInverted ? [0.3, 0.6, 0.3] : [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
        
        {/* 17. Floating particles */}
        {[...Array(12)].map((_, i) => {
          const colors = isInverted ?
            ['#E94560', '#6DD5FA', '#FDE68A', '#6EE7B7', '#C4B5FD', '#FDA4AF', '#A5B4FC', '#5EEAD4'] :
            ['#E94560', '#3498DB', '#F1C40F', '#2ECC71', '#9B59B6', '#F43F5E', '#6366F1', '#14B8A6'];
          return (
            <motion.div
              key={`particle-${i}-${invertKey}`}
              className="absolute w-0.5 h-0.5 rounded-full"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${5 + (i * 11) % 80}%`,
                background: colors[i % colors.length],
                opacity: isInverted ? 0.15 : 0.08,
              }}
              animate={{
                x: (mouse.normalizedX - 0.5) * (20 + i * 2),
                y: (mouse.normalizedY - 0.5) * (20 + i * 2),
                scale: [1, 1.5 + (i % 3) * 0.5, 1],
                opacity: isInverted ? [0.15, 0.4, 0.15] : [0.08, 0.25, 0.08],
              }}
              transition={{
                x: { type: "spring", damping: 25, stiffness: 40 + i * 3 },
                y: { type: "spring", damping: 25, stiffness: 40 + i * 3 },
                scale: { duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
                opacity: { duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
              }}
            />
          );
        })}
        
        {/* 18. Horizontal rules */}
        <div className="absolute inset-0">
          {[25, 50, 75].map((pos, i) => (
            <motion.div
              key={`hrule-${i}-${invertKey}`}
              className="absolute left-0 right-0 border-t"
              style={{ 
                top: `${pos}%`, 
                borderColor: borderColorLight
              }}
              animate={{
                opacity: [0.03, 0.06, 0.03],
                scaleX: [1, 1.02, 1],
                x: mouse.normalizedX * 5 - 2.5,
              }}
              transition={{
                opacity: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: i * 2 },
                scaleX: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: i * 2 },
                x: { type: "spring", damping: 30, stiffness: 50 },
              }}
            />
          ))}
        </div>
        
        {/* 19. Vertical rules */}
        <div className="absolute inset-0">
          {[25, 50, 75].map((pos, i) => (
            <motion.div
              key={`vrule-${i}-${invertKey}`}
              className="absolute top-0 bottom-0 border-l"
              style={{ 
                left: `${pos}%`, 
                borderColor: borderColorLight
              }}
              animate={{
                opacity: [0.02, 0.05, 0.02],
                scaleY: [1, 1.02, 1],
                y: mouse.normalizedY * 5 - 2.5,
              }}
              transition={{
                opacity: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 2 },
                scaleY: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 + i * 2 },
                y: { type: "spring", damping: 30, stiffness: 50 },
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Grid lines */}
      {showGrid && (
        <motion.div 
          key={`grid-${invertKey}`}
          className="absolute inset-0 opacity-10 pointer-events-none"
          animate={{
            x: offsetX * 0.08,
            y: offsetY * 0.08,
            opacity: 0.08 + Math.abs(mouse.normalizedX - 0.5) * 0.04,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 80 }}
        >
          <div className="grid grid-cols-12 h-full w-full px-6">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={`gridcol-${i}-${invertKey}`}
                className="border-r h-full"
                style={{ borderColor: borderColor }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={`gridrow-${i}-${invertKey}`}
                className="border-b w-full flex-1"
                style={{ borderColor: borderColorLight }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05 + 1.5,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Mouse follower glow */}
      <motion.div
        key={`glow-${invertKey}`}
        className="absolute pointer-events-none rounded-full"
        style={{
          left: mouse.x - 120,
          top: mouse.y - 120,
          width: 240,
          height: 240,
        }}
        animate={{
          background: isInverted ? `
            radial-gradient(circle, 
              rgba(139,47,58,${0.02 + velocity * 0.01}) 0%, 
              rgba(52,152,219,${0.01 + velocity * 0.005}) 30%,
              transparent 70%
            )
          ` : `
            radial-gradient(circle, 
              rgba(139,47,58,${0.06 + velocity * 0.02}) 0%, 
              rgba(52,152,219,${0.03 + velocity * 0.01}) 30%,
              transparent 70%
            )
          `,
          scale: 1 + velocity * 0.8,
          opacity: Math.min(0.3 + velocity * 0.05, 0.8),
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100 }}
      />
      
      {/* Secondary mouse follower */}
      <motion.div
        key={`glow2-${invertKey}`}
        className="absolute pointer-events-none rounded-full"
        style={{
          left: mouse.x - 180,
          top: mouse.y - 180,
          width: 360,
          height: 360,
        }}
        animate={{
          background: isInverted ? `
            radial-gradient(circle, 
              rgba(0,0,0,${0.005 + velocity * 0.002}) 0%, 
              transparent 70%
            )
          ` : `
            radial-gradient(circle, 
              rgba(255,255,255,${0.01 + velocity * 0.005}) 0%, 
              transparent 70%
            )
          `,
          scale: 1 + velocity * 0.5,
          opacity: Math.min(0.1 + velocity * 0.02, 0.3),
        }}
        transition={{ type: "spring", damping: 40, stiffness: 60 }}
      />
      
      {/* Mouse velocity indicator */}
      {velocity > 0.5 && (
        <motion.div
          key={`ring-${invertKey}`}
          className="absolute pointer-events-none border rounded-full"
          style={{
            left: mouse.x - 80 - velocity * 20,
            top: mouse.y - 80 - velocity * 20,
            width: 160 + velocity * 40,
            height: 160 + velocity * 40,
            borderColor: isInverted ? 'rgba(17,17,17,0.1)' : 'rgba(233,69,96,0.1)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      {/* Dynamic background texture */}
      <motion.div
        key={`texture-${invertKey}`}
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        animate={{
          background: isInverted ? `
            radial-gradient(
              ellipse at ${mouse.normalizedX * 100}% ${mouse.normalizedY * 100}%,
              rgba(17,17,17,0.05) 0%,
              transparent 50%
            )
          ` : `
            radial-gradient(
              ellipse at ${mouse.normalizedX * 100}% ${mouse.normalizedY * 100}%,
              rgba(139,47,58,0.1) 0%,
              transparent 50%
            )
          `,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50 }}
      />

      {/* Inversion status indicator */}
      <motion.div
        className="fixed bottom-4 left-4 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInverted ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[8px] text-secondary/40 tracking-wider font-light uppercase">
            Inverted
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveBackground;