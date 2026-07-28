import React from 'react';
import { motion } from 'framer-motion';

interface GeometricShapesProps {
  currentTime?: number;
}

const GeometricShapes: React.FC<GeometricShapesProps> = ({ currentTime = 0 }) => {
  // Calculate some variations based on time
  const phase = Math.sin(currentTime * 0.5) * 0.5 + 0.5;
  const phase2 = Math.sin(currentTime * 0.3 + 1) * 0.5 + 0.5;
  const phase3 = Math.sin(currentTime * 0.7 + 2) * 0.5 + 0.5;

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {/* Large diagonal rectangle - Deep Red */}
      <motion.div
        className="absolute top-[5%] left-[-5%] w-64 h-96 bg-accent/15 rotate-[35deg]"
        animate={{
          opacity: [0.08, 0.2, 0.08],
          x: [0, 20, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Large circle - Muted Blue */}
      <motion.div
        className="absolute bottom-[10%] right-[-8%] w-80 h-80 rounded-full bg-blue-500/10"
        animate={{
          opacity: [0.06, 0.15, 0.06],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Triangle - Warm Beige */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[104px] border-b-amber-200/10"
        animate={{
          opacity: [0.06, 0.15, 0.06],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Small square - Deep Crimson */}
      <motion.div
        className="absolute top-[45%] left-[8%] w-20 h-20 bg-red-600/15 rotate-12"
        animate={{
          opacity: [0.08, 0.2, 0.08],
          rotate: [12, 25, 12]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Diamond - Muted Navy */}
      <motion.div
        className="absolute bottom-[35%] right-[12%] w-16 h-16 bg-blue-800/15 rotate-45"
        animate={{
          opacity: [0.06, 0.18, 0.06],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Small circle - Warm Beige */}
      <motion.div
        className="absolute top-[60%] left-[20%] w-12 h-12 rounded-full bg-amber-300/12"
        animate={{
          opacity: [0.05, 0.15, 0.05],
          y: [0, -10, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Rectangle - Deep Crimson */}
      <motion.div
        className="absolute top-[15%] left-[45%] w-32 h-16 bg-red-700/10 rotate-[-15deg]"
        animate={{
          opacity: [0.05, 0.12, 0.05],
          x: [0, 15, 0]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Large triangle - Muted Blue */}
      <motion.div
        className="absolute bottom-[5%] left-[10%] w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[138px] border-b-blue-400/8"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [0, -3, 0]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Pentagon approximation (circle with border) */}
      <motion.div
        className="absolute top-[75%] right-[25%] w-16 h-16 border-4 border-teal-500/10 rotate-12"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [12, 30, 12]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      {/* Small diamond cluster */}
      <motion.div
        className="absolute top-[30%] left-[30%] flex gap-2"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          y: [0, -5, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      >
        <div className="w-4 h-4 bg-rose-400/20 rotate-45" />
        <div className="w-4 h-4 bg-amber-400/20 rotate-45" />
        <div className="w-4 h-4 bg-blue-400/20 rotate-45" />
      </motion.div>

      {/* Long horizontal bar - Deep Crimson */}
      <motion.div
        className="absolute top-[50%] left-[60%] w-48 h-2 bg-red-500/10"
        animate={{
          opacity: [0.04, 0.12, 0.04],
          width: ['12rem', '16rem', '12rem']
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Circle ring */}
      <motion.div
        className="absolute top-[12%] left-[68%] w-24 h-24 rounded-full border-2 border-indigo-400/10"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Hexagon (using clip-path) */}
      <motion.div
        className="absolute bottom-[45%] left-[45%] w-20 h-20 bg-violet-500/8"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
        }}
        animate={{
          opacity: [0.04, 0.12, 0.04],
          rotate: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Parallel bars */}
      <motion.div
        className="absolute top-[8%] left-[3%] flex flex-col gap-2"
        animate={{
          opacity: [0.04, 0.1, 0.04]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <div className="w-24 h-1 bg-emerald-400/15" />
        <div className="w-24 h-1 bg-emerald-400/10" />
        <div className="w-24 h-1 bg-emerald-400/5" />
      </motion.div>

      {/* Colorful squares grid */}
      <motion.div
        className="absolute top-[55%] left-[70%] grid grid-cols-3 gap-1"
        animate={{
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <div className="w-3 h-3 bg-rose-400/20" />
        <div className="w-3 h-3 bg-amber-400/20" />
        <div className="w-3 h-3 bg-emerald-400/20" />
        <div className="w-3 h-3 bg-blue-400/20" />
        <div className="w-3 h-3 bg-violet-400/20" />
        <div className="w-3 h-3 bg-rose-400/20" />
        <div className="w-3 h-3 bg-amber-400/20" />
        <div className="w-3 h-3 bg-emerald-400/20" />
        <div className="w-3 h-3 bg-blue-400/20" />
      </motion.div>

      {/* Diagonal stripe pattern block */}
      <motion.div
        className="absolute top-[5%] left-[75%] w-32 h-32 opacity-[0.04]"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            #8B2F3A 0px,
            #8B2F3A 2px,
            transparent 2px,
            transparent 8px
          )`
        }}
        animate={{
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Large rectangle with diagonal pattern */}
      <motion.div
        className="absolute bottom-[15%] left-[55%] w-40 h-24 opacity-[0.04]"
        style={{
          background: `repeating-linear-gradient(
            -45deg,
            #2563EB 0px,
            #2563EB 2px,
            transparent 2px,
            transparent 8px
          )`
        }}
        animate={{
          opacity: [0.03, 0.08, 0.03],
          x: [0, -10, 0]
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
      />

      {/* Concentric circles */}
      <motion.div
        className="absolute top-[40%] right-[5%]"
        animate={{
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full border border-amber-200/10" />
        <div className="w-12 h-12 rounded-full border border-amber-200/15 -mt-14 ml-2" />
        <div className="w-8 h-8 rounded-full border border-amber-200/20 -mt-10 ml-4" />
        <div className="w-4 h-4 rounded-full border border-amber-200/25 -mt-6 ml-6" />
      </motion.div>

      {/* Geometric cross */}
      <motion.div
        className="absolute top-[70%] left-[5%]"
        animate={{
          opacity: [0.04, 0.1, 0.04],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.3 }}
      >
        <div className="w-12 h-2 bg-rose-400/15" />
        <div className="w-2 h-12 bg-rose-400/15 -mt-7 ml-5" />
      </motion.div>

      {/* Dot pattern */}
      <motion.div
        className="absolute bottom-[30%] left-[25%] grid grid-cols-4 gap-2"
        animate={{
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: ['#8B2F3A', '#2563EB', '#F59E0B', '#10B981'][i % 4],
              opacity: 0.5
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default GeometricShapes;