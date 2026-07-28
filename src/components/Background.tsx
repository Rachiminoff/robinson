import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundProps {
  showGrid?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ showGrid = false }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Base background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] animate-noise">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maW0+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] bg-repeat bg-[length:300px_300px]" />
      </div>
      
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-[0.02] paper-texture" />
      
      {/* Grid lines */}
      {showGrid && (
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full w-full px-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-primary/20 h-full" />
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-b border-primary/10 w-full flex-1" />
            ))}
          </div>
        </div>
      )}
      
      {/* ===== GEOMETRIC SHAPES WITH ENHANCED ANIMATIONS ===== */}
      
      {/* 1. LARGE DIAGONAL RECTANGLE - Deep Red */}
      <motion.div
        className="absolute top-[5%] left-[-5%] w-80 h-96 bg-[#8B2F3A]/15 rotate-[35deg]"
        animate={{
          opacity: [0.08, 0.2, 0.08],
          x: [0, 20, 0],
          y: [0, -10, 0],
          rotate: [35, 38, 35]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* 2. LARGE CIRCLE - Muted Blue */}
      <motion.div
        className="absolute bottom-[10%] right-[-8%] w-96 h-96 rounded-full bg-[#2563EB]/10"
        animate={{
          opacity: [0.06, 0.15, 0.06],
          scale: [1, 1.05, 1],
          x: [0, -15, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* 3. LARGE TRIANGLE - Warm Beige/Amber */}
      <motion.div
        className="absolute top-[15%] right-[10%] w-0 h-0 border-l-[70px] border-l-transparent border-r-[70px] border-r-transparent border-b-[121px] border-b-[#F59E0B]/12"
        animate={{
          opacity: [0.06, 0.15, 0.06],
          rotate: [0, 5, -5, 0],
          y: [0, -8, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* 4. SQUARE - Deep Crimson */}
      <motion.div
        className="absolute top-[45%] left-[5%] w-24 h-24 bg-[#DC2626]/15 rotate-12"
        animate={{
          opacity: [0.08, 0.2, 0.08],
          rotate: [12, 25, 12],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* 5. DIAMOND - Muted Navy */}
      <motion.div
        className="absolute bottom-[35%] right-[10%] w-20 h-20 bg-[#1E3A8A]/15 rotate-45"
        animate={{
          opacity: [0.06, 0.18, 0.06],
          scale: [1, 1.1, 1],
          rotate: [45, 55, 45]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* 6. SMALL CIRCLE - Warm Beige */}
      <motion.div
        className="absolute top-[60%] left-[15%] w-16 h-16 rounded-full bg-[#F59E0B]/12"
        animate={{
          opacity: [0.05, 0.15, 0.05],
          y: [0, -10, 0],
          x: [0, 5, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* 7. RECTANGLE - Deep Crimson (rotated) */}
      <motion.div
        className="absolute top-[12%] left-[45%] w-40 h-16 bg-[#DC2626]/10 rotate-[-15deg]"
        animate={{
          opacity: [0.05, 0.12, 0.05],
          x: [0, 15, 0],
          rotate: [-15, -10, -15]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />
      
      {/* 8. LARGE TRIANGLE - Muted Blue */}
      <motion.div
        className="absolute bottom-[5%] left-[8%] w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-b-[156px] border-b-[#3B82F6]/8"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [0, -3, 3, 0],
          x: [0, 8, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* 9. PENTAGON (circle with border) - Teal */}
      <motion.div
        className="absolute top-[75%] right-[20%] w-20 h-20 border-4 border-[#14B8A6]/10 rotate-12"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [12, 30, 12],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      
      {/* 10. DIAMOND CLUSTER - Multi-color */}
      <motion.div
        className="absolute top-[28%] left-[30%] flex gap-3"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          y: [0, -5, 0],
          x: [0, 4, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <motion.div 
          className="w-5 h-5 bg-[#F43F5E]/20 rotate-45"
          animate={{ rotate: [45, 50, 45] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-5 h-5 bg-[#F59E0B]/20 rotate-45"
          animate={{ rotate: [45, 35, 45] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="w-5 h-5 bg-[#3B82F6]/20 rotate-45"
          animate={{ rotate: [45, 55, 45] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
      
      {/* 11. HORIZONTAL BAR - Deep Crimson */}
      <motion.div
        className="absolute top-[50%] left-[55%] h-3 bg-[#DC2626]/10 rounded-full"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          width: ['14rem', '18rem', '14rem'],
          x: [0, -5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      
      {/* 12. CIRCLE RING - Indigo */}
      <motion.div
        className="absolute top-[8%] left-[70%] w-28 h-28 rounded-full border-2 border-[#6366F1]/10"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          scale: [1, 1.2, 1],
          rotate: [0, 15, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* 13. HEXAGON - Violet */}
      <motion.div
        className="absolute bottom-[45%] left-[40%] w-24 h-24 bg-[#8B5CF6]/10"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [0, 30, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* 14. PARALLEL BARS - Emerald */}
      <motion.div
        className="absolute top-[5%] left-[3%] flex flex-col gap-3"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          x: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <motion.div 
          className="w-32 h-1.5 bg-[#10B981]/20 rounded-full"
          animate={{ width: ['8rem', '10rem', '8rem'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-32 h-1.5 bg-[#10B981]/15 rounded-full"
          animate={{ width: ['8rem', '12rem', '8rem'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="w-32 h-1.5 bg-[#10B981]/10 rounded-full"
          animate={{ width: ['8rem', '9rem', '8rem'] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
      
      {/* 15. COLORFUL SQUARES GRID */}
      <motion.div
        className="absolute top-[55%] left-[72%] grid grid-cols-3 gap-1.5"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [0, -3, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4"
            style={{
              background: ['#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F43F5E', '#F59E0B', '#10B981', '#3B82F6'][i],
              opacity: 0.25,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.4, 0.25]
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>
      
      {/* 16. DIAGONAL STRIPE BLOCK - Red Pattern */}
      <motion.div
        className="absolute top-[3%] left-[78%] w-40 h-40 opacity-[0.04]"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            #8B2F3A 0px,
            #8B2F3A 2px,
            transparent 2px,
            transparent 10px
          )`
        }}
        animate={{
          opacity: [0.03, 0.08, 0.03],
          rotate: [0, 2, 0]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />
      
      {/* 17. LARGE RECTANGLE WITH DIAGONAL PATTERN - Blue */}
      <motion.div
        className="absolute bottom-[12%] left-[50%] w-48 h-28 opacity-[0.04]"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            #2563EB 0px,
            #2563EB 2px,
            transparent 2px,
            transparent 10px
          )`
        }}
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [0, -10, 0],
          y: [0, 5, 0]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
      />
      
      {/* 18. CONCENTRIC CIRCLES - Amber */}
      <motion.div
        className="absolute top-[40%] right-[3%]"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [0, -5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <motion.div 
          className="w-20 h-20 rounded-full border border-[#F59E0B]/15"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-14 h-14 rounded-full border border-[#F59E0B]/20 -mt-17 ml-3"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="w-10 h-10 rounded-full border border-[#F59E0B]/25 -mt-12 ml-5"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="w-6 h-6 rounded-full border border-[#F59E0B]/30 -mt-8 ml-7"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div 
          className="w-2 h-2 rounded-full bg-[#F59E0B]/20 -mt-4 ml-9"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      
      {/* 19. GEOMETRIC CROSS - Rose */}
      <motion.div
        className="absolute top-[70%] left-[3%]"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
      >
        <motion.div 
          className="w-16 h-3 bg-[#F43F5E]/15 rounded-full"
          animate={{ width: ['4rem', '5rem', '4rem'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-3 h-16 bg-[#F43F5E]/15 rounded-full -mt-9 ml-6.5"
          animate={{ height: ['4rem', '5rem', '4rem'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>
      
      {/* 20. DOT PATTERN - Multi-color */}
      <motion.div
        className="absolute bottom-[30%] left-[22%] grid grid-cols-4 gap-2.5"
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [0, 3, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: ['#8B2F3A', '#2563EB', '#F59E0B', '#10B981', '#8B5CF6', '#F43F5E', '#6366F1', '#14B8A6'][i % 8],
              opacity: 0.5
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2 + (i % 3) * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08
            }}
          />
        ))}
      </motion.div>
      
      {/* 21. DIAGONAL LINES */}
      <motion.div
        className="absolute top-[18%] right-[25%] flex flex-col gap-4"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          x: [0, -4, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
      >
        <motion.div 
          className="w-24 h-px bg-[#F43F5E]/20 rotate-45 origin-right"
          animate={{ width: ['6rem', '8rem', '6rem'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-24 h-px bg-[#F43F5E]/20 rotate-45 origin-right"
          animate={{ width: ['6rem', '9rem', '6rem'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="w-24 h-px bg-[#F43F5E]/20 rotate-45 origin-right"
          animate={{ width: ['6rem', '7rem', '6rem'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
      
      {/* 22. TRIANGLE CLUSTER */}
      <motion.div
        className="absolute bottom-[20%] right-[30%] flex gap-2"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          y: [0, 5, 0],
          x: [0, -3, 0]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <motion.div 
          className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-[#8B2F3A]/20"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-[#2563EB]/20"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div 
          className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-[#F59E0B]/20"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>
      
      {/* 23. LARGE VERTICAL BAR - Indigo */}
      <motion.div
        className="absolute top-[10%] left-[55%] w-2 bg-[#6366F1]/10 rounded-full"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          height: ['12rem', '16rem', '12rem'],
          y: [0, 5, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* 24. RECTANGLE WITH BORDER - Teal */}
      <motion.div
        className="absolute top-[30%] right-[5%] w-32 h-20 border-2 border-[#14B8A6]/10"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          rotate: [0, 3, -3, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2.8 }}
      />
      
      {/* 25. SMALL TRIANGLE - Rose */}
      <motion.div
        className="absolute top-[80%] left-[35%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-[#F43F5E]/12"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          rotate: [0, -5, 5, 0],
          y: [0, -3, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      
      {/* 26. DIAGONAL STRIPES OVERLAY */}
      <motion.div 
        className="absolute inset-0 opacity-[0.015]"
        animate={{ opacity: [0.015, 0.025, 0.015] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 30px,
            rgba(245,245,245,0.3) 30px,
            rgba(245,245,245,0.3) 31px
          )`
        }} />
      </motion.div>
      
      {/* 27. HORIZONTAL RULES */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-[25%] left-0 right-0 border-t border-primary/5"
          animate={{ opacity: [0.03, 0.06, 0.03], scaleX: [1, 1.02, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-[50%] left-0 right-0 border-t border-primary/5"
          animate={{ opacity: [0.03, 0.06, 0.03], scaleX: [1, 1.02, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute top-[75%] left-0 right-0 border-t border-primary/5"
          animate={{ opacity: [0.03, 0.06, 0.03], scaleX: [1, 1.02, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 4 }}
        />
      </div>
      
      {/* 28. VERTICAL RULES */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute left-[25%] top-0 bottom-0 border-l border-primary/5"
          animate={{ opacity: [0.02, 0.05, 0.02], scaleY: [1, 1.02, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute left-[50%] top-0 bottom-0 border-l border-primary/5"
          animate={{ opacity: [0.02, 0.05, 0.02], scaleY: [1, 1.02, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 3 }}
        />
        <motion.div 
          className="absolute left-[75%] top-0 bottom-0 border-l border-primary/5"
          animate={{ opacity: [0.02, 0.05, 0.02], scaleY: [1, 1.02, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 5 }}
        />
      </div>
      
      {/* 29. CORNER DECORATIONS */}
      <div className="absolute inset-0">
        {/* Top-left */}
        <motion.div 
          className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-primary/10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-14 left-14 w-8 h-8 border-t-2 border-l-2 border-primary/5"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Top-right */}
        <motion.div 
          className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-primary/10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute top-14 right-14 w-8 h-8 border-t-2 border-r-2 border-primary/5"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1.5 }}
        />
        
        {/* Bottom-left */}
        <motion.div 
          className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-primary/10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-14 left-14 w-8 h-8 border-b-2 border-l-2 border-primary/5"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2.5 }}
        />
        
        {/* Bottom-right */}
        <motion.div 
          className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 border-primary/10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 3 }}
        />
        <motion.div 
          className="absolute bottom-14 right-14 w-8 h-8 border-b-2 border-r-2 border-primary/5"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 3.5 }}
        />
      </div>
      
      {/* 30. CIRCLE WITH DOTS */}
      <motion.div
        className="absolute top-[5%] left-[40%]"
        animate={{
          opacity: [0.03, 0.07, 0.03],
          x: [0, 4, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <motion.div 
          className="w-48 h-48 rounded-full border border-primary/5"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/10" />
        <motion.div 
          className="absolute top-[10%] left-[10%] w-1.5 h-1.5 rounded-full bg-[#F43F5E]/15"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-[15%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#2563EB]/15"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#F59E0B]/15"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-[25%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#10B981]/15"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
      </motion.div>
      
      {/* 31. FLOATING PARTICLES */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-primary/10"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -20 - Math.random() * 30, 0],
            x: [0, 10 - Math.random() * 20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Film grain animation */}
      <div className="absolute inset-0 animate-film-grain opacity-[0.02]">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-primary/5 to-transparent" />
      </div>
    </div>
  );
};

export default Background;