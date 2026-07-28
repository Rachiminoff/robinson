import React from 'react';
import { motion } from 'framer-motion';

const NoiseOverlay: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      initial={{ opacity: 0.03 }}
      animate={{ opacity: [0.03, 0.06, 0.02, 0.04, 0.03] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIwLjYiLz48L3N2Zz4=')] bg-repeat bg-[length:400px_400px]" />
    </motion.div>
  );
};

export default NoiseOverlay;