import { useRef, useEffect } from 'react';
import { useSpring, useTransform, MotionValue } from 'framer-motion';

export const useParallax = (
  mouseX: number,
  mouseY: number,
  sensitivity: number = 0.02,
  springConfig = { damping: 20, stiffness: 100 }
) => {
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    const targetX = (mouseX - 0.5) * sensitivity;
    const targetY = (mouseY - 0.5) * sensitivity;
    springX.set(targetX);
    springY.set(targetY);
  }, [mouseX, mouseY, sensitivity, springX, springY]);

  return { x: springX, y: springY };
};