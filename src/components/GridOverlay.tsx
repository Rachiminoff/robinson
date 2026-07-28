import React from 'react';

interface GridOverlayProps {
  visible: boolean;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <div className="grid grid-cols-12 h-full w-full px-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-primary/5 h-full" />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col px-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-b border-primary/5 w-full flex-1" />
        ))}
      </div>
    </div>
  );
};

export default GridOverlay;