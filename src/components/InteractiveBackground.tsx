// src/components/InteractiveBackground.tsx

import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { useMouseTracking } from '../hooks/useMouseTracking';
import { GeometryConfig } from '../types/composition';

interface InteractiveBackgroundProps {
  composition: GeometryConfig;
  isPlaying: boolean;
  currentTime: number;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ 
  composition, 
  isPlaying, 
  currentTime 
}) => {
  const mouse = useMouseTracking();
  const containerRef = useRef<HTMLDivElement>(null);
  const { shapes, colors } = composition;
  
  // Spring values for smooth interactions
  const x = useSpring(0, { damping: 30, stiffness: 120, mass: 0.8 });
  const y = useSpring(0, { damping: 30, stiffness: 120, mass: 0.8 });
  const scale = useSpring(1, { damping: 25, stiffness: 100, mass: 0.6 });
  const rotate = useSpring(0, { damping: 35, stiffness: 80, mass: 0.5 });
  
  // Update spring values based on mouse
  useEffect(() => {
    const targetX = (mouse.normalizedX - 0.5) * 60;
    const targetY = (mouse.normalizedY - 0.5) * 60;
    x.set(targetX);
    y.set(targetY);
  }, [mouse.normalizedX, mouse.normalizedY, x, y]);
  
  // Breathing animation
  useEffect(() => {
    if (isPlaying) {
      let frame: number;
      let startTime = Date.now();
      
      const breathe = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const rhythm = 3 + Math.sin(currentTime / 10) * 0.5;
        const breathValue = Math.sin(elapsed / rhythm) * 0.015;
        scale.set(1 + breathValue);
        
        const rotateValue = Math.sin(elapsed / (rhythm * 1.5)) * 0.3;
        rotate.set(rotateValue);
        
        frame = requestAnimationFrame(breathe);
      };
      
      breathe();
      return () => cancelAnimationFrame(frame);
    }
  }, [isPlaying, currentTime, scale, rotate]);

  // Enhanced shape rendering with cinematic animations
  const renderShape = (shape: any, index: number) => {
    const mood = (composition as any).mood || 'balanced';
    const moodOpacity = mood === 'dramatic' ? 1.4 : 
                        mood === 'minimal' ? 0.5 : 1;
    
    const baseDelay = index * 0.05;
    const speedMultiplier = mood === 'dramatic' ? 0.5 :
                           mood === 'elegant' ? 1.6 : 1;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
      willChange: 'transform, opacity',
      backfaceVisibility: 'hidden',
    };

    const color = shape.color;
    const opacity = Math.min(shape.opacity * 2 * moodOpacity, 0.35);

    // Unique motion offsets for each shape
    const getMotionOffset = () => {
      const offsets = [
        { x: 15, y: -20 },
        { x: 20, y: 10 },
        { x: -10, y: 15 },
        { x: 25, y: -15 },
      ];
      return offsets[index % offsets.length];
    };

    const offset = getMotionOffset();

    // Calculate animated values
    const animX = x.get() * (0.3 + index * 0.02);
    const animY = y.get() * (0.3 + index * 0.02) + Math.sin(currentTime / (4 * speedMultiplier) + index * 1.5) * offset.y * 0.5;
    const animScale = scale.get() * (1 + Math.sin(currentTime / (4 * speedMultiplier) + index * 1.5) * 0.025);

    switch (shape.type) {
      case 'circle':
        return (
          <motion.div
            key={`circle-${index}`}
            className="rounded-full"
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 20,
            }}
            animate={{ 
              opacity: opacity,
              scale: animScale,
              y: 0,
              x: animX,
            }}
            exit={{
              opacity: 0,
              scale: 0.6,
              y: -20,
            }}
            transition={{ 
              duration: 0.8,
              delay: baseDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              ...baseStyle,
              width: shape.width,
              height: shape.height,
              background: color,
              border: `2px solid ${color}66`,
              boxShadow: `0 0 40px ${color}22`,
            }}
          />
        );
        
      case 'rectangle':
        const rectAnimX = x.get() * (0.4 + index * 0.015);
        const rectAnimY = y.get() * (0.4 + index * 0.015) + Math.sin(currentTime / (6 * speedMultiplier) + index * 0.8) * offset.y * 0.3;
        const rectAnimRotate = shape.rotation + Math.sin(currentTime / (6 * speedMultiplier) + index * 0.8) * 3 + rotate.get();
        const rectAnimScale = scale.get() * (1 + Math.sin(currentTime / (5 * speedMultiplier) + index * 0.7) * 0.02);
        
        return (
          <motion.div
            key={`rect-${index}`}
            initial={{ 
              opacity: 0, 
              scale: 0.7,
              rotate: -10,
            }}
            animate={{ 
              opacity: opacity,
              scale: rectAnimScale,
              rotate: rectAnimRotate,
              x: rectAnimX,
              y: rectAnimY,
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              rotate: 10,
            }}
            transition={{ 
              duration: 0.9,
              delay: baseDelay + 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              ...baseStyle,
              width: shape.width,
              height: shape.height,
              background: color,
              border: `2px solid ${color}66`,
              boxShadow: `0 0 30px ${color}11`,
            }}
          />
        );
        
      case 'triangle':
        const triAnimX = x.get() * (0.2 + index * 0.03);
        const triAnimY = y.get() * (0.2 + index * 0.03) + Math.sin(currentTime / (5 * speedMultiplier) + index * 1.2) * offset.y * 0.4;
        const triAnimRotate = shape.rotation + Math.sin(currentTime / (5 * speedMultiplier) + index * 1.2) * 4 + rotate.get() * 0.5;
        const triAnimScale = scale.get() * (1 + Math.sin(currentTime / (3.5 * speedMultiplier) + index * 0.9) * 0.025);
        
        return (
          <motion.div
            key={`tri-${index}`}
            initial={{ 
              opacity: 0, 
              scale: 0.6,
              y: 30,
            }}
            animate={{ 
              opacity: opacity,
              scale: triAnimScale,
              y: 0,
              x: triAnimX,
              rotate: triAnimRotate,
            }}
            exit={{
              opacity: 0,
              scale: 0.4,
              y: -30,
            }}
            transition={{ 
              duration: 0.7,
              delay: baseDelay + 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${shape.width / 2}px solid transparent`,
              borderRight: `${shape.width / 2}px solid transparent`,
              borderBottom: `${shape.height}px solid ${color}`,
              filter: `drop-shadow(0 0 20px ${color}22)`,
            }}
          />
        );
        
      case 'line':
        const lineAnimX = x.get() * (0.2 + index * 0.04);
        const lineAnimY = y.get() * (0.2 + index * 0.04) + Math.sin(currentTime / (8 * speedMultiplier) + index * 0.5) * offset.y * 0.2;
        const lineAnimRotate = shape.rotation + Math.sin(currentTime / (8 * speedMultiplier) + index * 0.5) * 1.5 + rotate.get() * 0.3;
        const lineAnimScaleX = scale.get() * (1 + Math.sin(currentTime / (6 * speedMultiplier) + index * 0.6) * 0.04);
        
        return (
          <motion.div
            key={`line-${index}`}
            initial={{ 
              opacity: 0, 
              scaleX: 0,
              x: -20,
            }}
            animate={{ 
              opacity: opacity * 1.2,
              scaleX: lineAnimScaleX,
              x: lineAnimX,
              y: lineAnimY,
              rotate: lineAnimRotate,
            }}
            exit={{
              opacity: 0,
              scaleX: 0,
              x: 20,
            }}
            transition={{ 
              duration: 0.6,
              delay: baseDelay + 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              ...baseStyle,
              width: shape.width,
              height: Math.max(shape.height, 2),
              background: color,
              boxShadow: `0 0 20px ${color}11`,
            }}
          />
        );
        
      default:
        return null;
    }
  };

  // Render Swiss design elements with elegant transitions
  const renderSwissElements = () => {
    const elements = [];
    const primary = colors.primary;
    const secondary = colors.secondary;
    const accent = colors.accent;
    const mood = (composition as any).mood || 'balanced';
    
    const getMoodScale = () => {
      switch(mood) {
        case 'dramatic': return 1.4;
        case 'minimal': return 0.6;
        case 'elegant': return 0.9;
        default: return 1;
      }
    };
    
    const moodScale = getMoodScale();
    const baseOpacity = mood === 'minimal' ? 0.03 : 0.07;
    const baseDelay = 0.2;

    // Large circle with smooth entrance
    elements.push(
      <motion.div
        key="swiss-circle-1"
        className="absolute rounded-full"
        initial={{ 
          opacity: 0, 
          scale: 0.8,
          y: 50,
        }}
        animate={{ 
          opacity: baseOpacity,
          scale: 1 + Math.sin(currentTime / 20) * 0.03,
          y: 0,
          x: x.get() * 0.12,
        }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 60, 
          mass: 0.8,
          delay: baseDelay,
        }}
        style={{
          width: 400 * moodScale,
          height: 400 * moodScale,
          background: primary,
          top: '10%',
          right: '-5%',
          border: `2px solid ${primary}`,
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Secondary circle with staggered entrance
    elements.push(
      <motion.div
        key="swiss-circle-2"
        className="absolute rounded-full"
        initial={{ 
          opacity: 0, 
          scale: 0.6,
          x: -50,
        }}
        animate={{ 
          opacity: baseOpacity * 0.7,
          scale: 1 + Math.sin(currentTime / 25 + 1) * 0.025,
          x: 0,
          y: y.get() * -0.1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 60,
          mass: 0.8,
          delay: baseDelay + 0.3,
        }}
        style={{
          width: 250 * moodScale,
          height: 250 * moodScale,
          background: secondary,
          bottom: '15%',
          left: '-5%',
          border: `1.5px solid ${secondary}`,
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Large square with dramatic entrance
    elements.push(
      <motion.div
        key="swiss-square"
        className="absolute"
        initial={{ 
          opacity: 0, 
          rotate: -20,
          scale: 0.7,
        }}
        animate={{ 
          opacity: baseOpacity * 0.8,
          rotate: 15 + Math.sin(currentTime / 25) * 3 + rotate.get() * 0.2,
          scale: 1,
          x: x.get() * 0.1,
          y: y.get() * 0.1,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 60,
          mass: 0.8,
          delay: baseDelay + 0.5,
        }}
        style={{
          width: 200 * moodScale,
          height: 200 * moodScale,
          background: secondary,
          bottom: '10%',
          left: '-3%',
          border: `2px solid ${secondary}`,
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Grid squares with staggered entrance
    const gridSize = mood === 'minimal' ? 4 : mood === 'dramatic' ? 8 : 6;
    for (let i = 0; i < gridSize; i++) {
      const size = 16 + i * 10;
      const colors_ = [primary, secondary, accent];
      const color = colors_[i % 3];
      const opacity = (baseOpacity * 0.8) + i * 0.015;
      
      elements.push(
        <motion.div
          key={`square-${i}`}
          className="absolute"
          initial={{ 
            opacity: 0, 
            scale: 0.5,
            rotate: -30,
          }}
          animate={{ 
            opacity: opacity * (0.8 + Math.sin(currentTime / 8 + i * 0.5) * 0.1),
            scale: 1 + Math.sin(currentTime / 6 + i * 0.7) * 0.06,
            rotate: 45 + Math.sin(currentTime / 10 + i) * 6 + rotate.get() * 0.1,
            x: x.get() * 0.05 * i,
            y: y.get() * 0.05 * i,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 60,
            mass: 0.6,
            delay: baseDelay + 0.2 + i * 0.06,
          }}
          style={{
            width: size * (mood === 'dramatic' ? 1.2 : 1),
            height: size * (mood === 'dramatic' ? 1.2 : 1),
            background: color,
            top: `${10 + i * 13}%`,
            left: `${5 + i * 10}%`,
            border: `1px solid ${color}66`,
            willChange: 'transform, opacity',
          }}
        />
      );
    }
    
    // Diagonal stripes with elegant reveal
    const stripeThickness = mood === 'dramatic' ? 6 : mood === 'minimal' ? 2 : 4;
    elements.push(
      <motion.div
        key="stripe-1"
        className="absolute"
        initial={{ 
          opacity: 0, 
          x: -100,
        }}
        animate={{ 
          opacity: baseOpacity * (0.8 + Math.sin(currentTime / 15) * 0.15),
          x: x.get() * 0.06,
          y: y.get() * 0.06,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 60,
          mass: 0.6,
          delay: baseDelay + 0.8,
        }}
        style={{
          width: '100%',
          height: `${stripeThickness}px`,
          background: accent,
          top: '25%',
          transform: 'rotate(-15deg)',
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Second stripe with different entrance
    elements.push(
      <motion.div
        key="stripe-2"
        className="absolute"
        initial={{ 
          opacity: 0, 
          x: 100,
        }}
        animate={{ 
          opacity: baseOpacity * 0.8 * (0.8 + Math.sin(currentTime / 18 + 1) * 0.15),
          x: x.get() * -0.04,
          y: y.get() * -0.04,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 60,
          mass: 0.6,
          delay: baseDelay + 1.0,
        }}
        style={{
          width: '100%',
          height: `${stripeThickness * 0.75}px`,
          background: secondary,
          bottom: '30%',
          transform: 'rotate(8deg)',
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Frames with elegant reveal
    const frameOpacity = mood === 'minimal' ? 0.02 : 0.045;
    elements.push(
      <motion.div
        key="frame"
        className="absolute"
        initial={{ 
          opacity: 0, 
          scale: 0.9,
        }}
        animate={{ 
          opacity: frameOpacity * (0.8 + Math.sin(currentTime / 22) * 0.1),
          scale: 1 + Math.sin(currentTime / 20) * 0.008,
          rotate: 0.5 + Math.sin(currentTime / 25) * 0.3 + rotate.get() * 0.05,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 60,
          mass: 0.8,
          delay: baseDelay + 0.4,
        }}
        style={{
          width: '60%',
          height: '60%',
          border: `${mood === 'dramatic' ? '4px' : '2px'} solid ${primary}`,
          top: '20%',
          left: '20%',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Second frame with staggered entrance
    elements.push(
      <motion.div
        key="frame-2"
        className="absolute"
        initial={{ 
          opacity: 0, 
          scale: 0.8,
        }}
        animate={{ 
          opacity: frameOpacity * 0.6 * (0.8 + Math.sin(currentTime / 25 + 0.5) * 0.1),
          scale: 1 + Math.sin(currentTime / 22 + 1) * 0.008,
          rotate: -0.3 + Math.sin(currentTime / 30 + 1) * 0.2 + rotate.get() * 0.03,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 60,
          mass: 0.8,
          delay: baseDelay + 0.6,
        }}
        style={{
          width: '45%',
          height: '45%',
          border: `1px solid ${secondary}`,
          top: '27.5%',
          left: '27.5%',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />
    );
    
    // Dots with staggered wave entrance
    const dotDensity = mood === 'minimal' ? 5 : mood === 'dramatic' ? 10 : 8;
    const dotRows = mood === 'minimal' ? 3 : mood === 'dramatic' ? 7 : 6;
    for (let i = 0; i < dotRows; i++) {
      for (let j = 0; j < dotDensity; j++) {
        if ((i + j) % 2 === 0) continue;
        const dotSize = 2 + (i % 3);
        const color = [primary, secondary, accent][(i + j) % 3];
        const spacing = 100 / (dotDensity + 1);
        const delay = baseDelay + (i * 0.08) + (j * 0.04);
        
        elements.push(
          <motion.div
            key={`dot-${i}-${j}`}
            className="absolute rounded-full"
            initial={{ 
              opacity: 0, 
              scale: 0,
            }}
            animate={{ 
              opacity: ((baseOpacity * 0.7) + (i + j) * 0.005) * (0.8 + Math.sin(currentTime / 5 + i + j) * 0.15),
              scale: 1 + Math.sin(currentTime / 8 + i + j) * 0.3,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 60,
              mass: 0.4,
              delay: delay,
            }}
            style={{
              width: dotSize * (mood === 'dramatic' ? 1.5 : 1),
              height: dotSize * (mood === 'dramatic' ? 1.5 : 1),
              background: color,
              top: `${15 + i * 12}%`,
              left: `${5 + j * spacing}%`,
              willChange: 'transform, opacity',
            }}
          />
        );
      }
    }
    
    return elements;
  };

  // Enhanced particles with cinematic motion
  const renderParticles = () => {
    if (!isPlaying) return null;
    
    const mood = (composition as any).mood || 'balanced';
    const particleCount = mood === 'dramatic' ? 15 : mood === 'minimal' ? 5 : 10;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const size = 1 + Math.random() * 3;
      const xPos = 5 + Math.random() * 90;
      const yPos = 5 + Math.random() * 90;
      const duration = 20 + Math.random() * 25;
      const delay = Math.random() * 10;
      const colors_ = [colors.primary, colors.secondary, colors.accent];
      const color = colors_[i % 3];
      
      particles.push(
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          initial={{ 
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 0.04, 0.01, 0.03, 0],
            scale: [0, 1, 0.5, 1.2, 0],
            x: [0, 30, -20, 40, -30, 0],
            y: [0, -40, 20, -30, 30, 0],
          }}
          transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: size,
            height: size,
            background: color,
            left: `${xPos}%`,
            top: `${yPos}%`,
            willChange: 'transform, opacity',
            boxShadow: `0 0 ${size * 4}px ${color}33`,
          }}
        />
      );
    }
    
    return particles;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        ref={containerRef} 
        className="fixed inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.0 }}
      >
        {/* Base background with smooth color transitions */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            background: colors.background,
            opacity: 1,
          }}
          transition={{ 
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ 
            transition: 'background 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
          }} 
        />
        
        {/* Paper texture with fade-in */}
        <motion.div 
          className="absolute inset-0 pointer-events-none" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.015 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
            backgroundRepeat: 'repeat',
          }} />
        </motion.div>
        
        {/* Swiss Grid with fade-in */}
        <motion.div 
          className="absolute inset-0 pointer-events-none" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <div className="grid grid-cols-12 h-full w-full px-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-[#1A2B4C] h-full" />
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col px-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border-b border-[#1A2B4C] w-full flex-1" />
            ))}
          </div>
        </motion.div>
        
        {/* Swiss design elements */}
        {renderSwissElements()}
        
        {/* Main shapes */}
        {shapes.map((shape, index) => renderShape(shape, index))}
        
        {/* Ambient particles */}
        {renderParticles()}
        
        {/* Mouse follower glow with smooth spring */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          animate={{
            scale: 1 + Math.sin(currentTime / 3) * 0.04,
            opacity: [0.025, 0.04, 0.025],
            x: mouse.x - 200,
            y: mouse.y - 200,
          }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 80,
            mass: 0.6,
          }}
          style={{
            width: 400,
            height: 400,
            background: colors.primary,
            willChange: 'transform, opacity',
          }}
        />
        
        {/* Secondary mouse glow with different timing */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          animate={{
            scale: 1 + Math.sin(currentTime / 2 + 0.5) * 0.06,
            opacity: [0.02, 0.035, 0.02],
            x: mouse.x - 100,
            y: mouse.y - 100,
          }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 80,
            mass: 0.6,
          }}
          style={{
            width: 200,
            height: 200,
            background: colors.accent,
            willChange: 'transform, opacity',
          }}
        />
        
        {/* Editorial accent blocks with smooth reveals */}
        <motion.div
          className="absolute pointer-events-none"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: 1 + Math.sin(currentTime / 20) * 0.03,
            opacity: 0.04 * (0.8 + Math.sin(currentTime / 20) * 0.1),
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 60,
            mass: 0.6,
            delay: 1.0,
          }}
          style={{
            width: '30%',
            height: '2px',
            background: colors.primary,
            bottom: '15%',
            right: '10%',
            transformOrigin: 'right',
            willChange: 'transform, opacity',
          }}
        />
        
        <motion.div
          className="absolute pointer-events-none"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: 1 + Math.sin(currentTime / 22 + 1) * 0.03,
            opacity: 0.03 * (0.8 + Math.sin(currentTime / 22 + 1) * 0.1),
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 60,
            mass: 0.6,
            delay: 1.2,
          }}
          style={{
            width: '20%',
            height: '2px',
            background: colors.secondary,
            top: '20%',
            left: '10%',
            transformOrigin: 'left',
            willChange: 'transform, opacity',
          }}
        />
        
        {/* Vignette with subtle pulse */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)`,
          }}
        />
        
        {/* Edge glow with subtle animation */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              `inset 0 0 100px ${colors.primary}05`,
              `inset 0 0 150px ${colors.primary}08`,
              `inset 0 0 100px ${colors.primary}05`,
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractiveBackground;