import { useState, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  velocity: number;
}

export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0.5,
    normalizedY: 0.5,
    velocity: 0,
  });
  const lastPosition = useRef({ x: 0, y: 0, time: Date.now() });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const normalizedX = x / window.innerWidth;
      const normalizedY = y / window.innerHeight;
      
      // Calculate velocity
      const now = Date.now();
      const dt = now - lastPosition.current.time;
      const dx = x - lastPosition.current.x;
      const dy = y - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = dt > 0 ? distance / dt : 0;
      
      setMousePosition({
        x,
        y,
        normalizedX,
        normalizedY,
        velocity: Math.min(velocity, 10),
      });
      
      lastPosition.current = { x, y, time: now };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};