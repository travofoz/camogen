"use client";

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { Polygon } from '../utils/camoEngine';

interface CamoCanvasProps {
  polygons: Polygon[];
  width: number;
  height: number;
  traceMode: boolean;
}

export default function CamoCanvas({ polygons, width, height, traceMode }: CamoCanvasProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPosition({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: any) => {
    e.preventDefault();
    const zoomSensitivity = 0.005;
    const delta = e.deltaY * -zoomSensitivity;
    let newScale = scale * Math.exp(delta);
    newScale = Math.min(Math.max(0.2, newScale), 5); // Limit zoom between 0.2x and 5x
    setScale(newScale);
  };

  useEffect(() => {
    const container = document.getElementById('canvas-container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scale]);

  return (
    <div 
      id="canvas-container"
      className="absolute inset-0 overflow-hidden touch-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <div 
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: width,
          height: height,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        className="will-change-transform cursor-grab active:cursor-grabbing"
      >
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width={width} 
          height={height}
          className="w-full h-full"
        >
          {polygons.map((poly) => {
            const pointsStr = poly.points.map(p => `${p.x},${p.y}`).join(' ');
            
            // Calculate center for text placement (rough centroid)
            const cx = poly.points.reduce((sum, p) => sum + p.x, 0) / poly.points.length;
            const cy = poly.points.reduce((sum, p) => sum + p.y, 0) / poly.points.length;

            return (
              <g key={poly.id}>
                <polygon 
                  points={pointsStr} 
                  fill={poly.color} 
                  fillOpacity={traceMode ? 0.6 : 1}
                  stroke={traceMode ? '#ffffff' : 'none'}
                  strokeWidth={traceMode ? 1 / scale : 0}
                  className="transition-all duration-300"
                />
                {traceMode && (
                  <text 
                    x={cx} 
                    y={cy} 
                    fill="white" 
                    fontSize={14 / scale}
                    fontWeight="bold"
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    style={{ pointerEvents: 'none', textShadow: '0px 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {poly.colorIndex}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
