"use client";

import { useState, useRef, useEffect } from 'react';
import { Polygon } from '../utils/camoEngine';
import { getTransform, Point } from '../utils/perspective';

interface CamoCanvasProps {
  polygons: Polygon[];
  width: number;
  height: number;
  traceMode: boolean;
  arMode: boolean;
}

export default function CamoCanvas({ polygons, width, height, traceMode, arMode }: CamoCanvasProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Pan/Zoom dragging
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // AR Warp handles (TopLeft, TopRight, BottomRight, BottomLeft)
  const [corners, setCorners] = useState<Point[]>([
    { x: 50, y: 150 },
    { x: 300, y: 150 },
    { x: 300, y: 400 },
    { x: 50, y: 400 }
  ]);
  const [activeCorner, setActiveCorner] = useState<number | null>(null);

  useEffect(() => {
    // Initialize corners nicely when AR mode turns on, if we know window size
    if (typeof window !== 'undefined') {
      const padding = 50;
      setCorners([
        { x: padding, y: padding + 100 },
        { x: window.innerWidth - padding, y: padding + 100 },
        { x: window.innerWidth - padding, y: window.innerHeight - 300 },
        { x: padding, y: window.innerHeight - 300 }
      ]);
    }
  }, [arMode]);

  const handlePointerDown = (e: any, cornerIndex?: number) => {
    if (arMode) {
      if (cornerIndex !== undefined) {
        setActiveCorner(cornerIndex);
      }
      return;
    }
    
    setIsDraggingCanvas(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };

  const handlePointerMove = (e: any) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (arMode && activeCorner !== null) {
      setCorners(prev => {
        const next = [...prev];
        next[activeCorner] = { x: clientX, y: clientY };
        return next;
      });
      return;
    }

    if (!arMode && isDraggingCanvas) {
      setPosition({
        x: clientX - dragStart.current.x,
        y: clientY - dragStart.current.y
      });
    }
  };

  const handlePointerUp = () => {
    setIsDraggingCanvas(false);
    setActiveCorner(null);
  };

  const handleWheel = (e: any) => {
    if (arMode) return;
    e.preventDefault();
    const zoomSensitivity = 0.005;
    const delta = e.deltaY * -zoomSensitivity;
    let newScale = scale * Math.exp(delta);
    newScale = Math.min(Math.max(0.2, newScale), 5);
    setScale(newScale);
  };

  useEffect(() => {
    const container = document.getElementById('canvas-container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [scale, arMode]);

  // Compute AR transform if needed
  const srcPoints = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height }
  ];
  
  const transformStyle = arMode 
    ? getTransform(srcPoints, corners)
    : `translate(${position.x}px, ${position.y}px) scale(${scale})`;

  return (
    <div 
      id="canvas-container"
      className={`absolute inset-0 overflow-hidden touch-none ${arMode ? 'pointer-events-none' : ''}`}
      onMouseDown={(e) => handlePointerDown(e)}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e)}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <div 
        style={{
          transform: transformStyle,
          transformOrigin: '0 0',
          width: width,
          height: height,
          transition: (isDraggingCanvas || activeCorner !== null) ? 'none' : 'transform 0.1s ease-out',
          pointerEvents: arMode ? 'none' : 'auto'
        }}
        className={arMode ? 'will-change-transform' : 'will-change-transform cursor-grab active:cursor-grabbing'}
      >
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          width={width} 
          height={height}
          className="w-full h-full"
        >
          {polygons.map((poly) => {
            const pointsStr = poly.points.map(p => `${p.x},${p.y}`).join(' ');
            const cx = poly.points.reduce((sum, p) => sum + p.x, 0) / poly.points.length;
            const cy = poly.points.reduce((sum, p) => sum + p.y, 0) / poly.points.length;

            return (
              <g key={poly.id}>
                <polygon 
                  points={pointsStr} 
                  fill={poly.color} 
                  fillOpacity={traceMode ? 0.6 : 1}
                  stroke={traceMode ? '#ffffff' : 'none'}
                  strokeWidth={traceMode ? (arMode ? 2 : 1 / scale) : 0}
                  className="transition-all duration-300"
                />
                {traceMode && (
                  <text 
                    x={cx} 
                    y={cy} 
                    fill="white" 
                    fontSize={arMode ? 24 : 14 / scale}
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

      {arMode && (
        <div className="absolute inset-0 pointer-events-auto">
          {/* Connecting lines for the AR bounding box guide */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polygon 
              points={corners.map(c => `${c.x},${c.y}`).join(' ')} 
              fill="none" 
              stroke="#5e7d43" 
              strokeWidth="2" 
              strokeDasharray="6 6"
            />
          </svg>

          {corners.map((corner, idx) => (
            <div
              key={idx}
              onMouseDown={(e) => { e.stopPropagation(); handlePointerDown(e, idx); }}
              onTouchStart={(e) => { e.stopPropagation(); handlePointerDown(e, idx); }}
              style={{
                left: corner.x - 20,
                top: corner.y - 20,
              }}
              className="absolute w-10 h-10 bg-[#5e7d43] border-4 border-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-move touch-none opacity-80 hover:opacity-100"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
