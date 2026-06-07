"use client";

import { useState, useEffect, useCallback } from 'react';
import CameraOverlay from '@/components/CameraOverlay';
import CamoCanvas from '@/components/CamoCanvas';
import Controls from '@/components/Controls';
import { generateSplinterPattern, Polygon } from '@/utils/camoEngine';
import { exportToSvg } from '@/utils/exportSvg';

export default function Home() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  // Default to trace mode ON so the camera feed is visible immediately
  const [traceMode, setTraceMode] = useState(true); 
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(65);
  const [jitter, setJitter] = useState(0.85);

  const regenerate = useCallback(() => {
    // Generate a pattern large enough to cover most screens, but allow panning
    const w = Math.max(typeof window !== 'undefined' ? window.innerWidth : 1200, 1200);
    const h = Math.max(typeof window !== 'undefined' ? window.innerHeight : 1200, 1200);
    setDimensions({ width: w, height: h });
    setPolygons(generateSplinterPattern(w, h, scale, jitter));
  }, [scale, jitter]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const handleExport = () => {
    exportToSvg(polygons, dimensions.width, dimensions.height);
  };

  if (polygons.length === 0) return null;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black select-none">
      <CameraOverlay />
      <CamoCanvas 
        polygons={polygons} 
        width={dimensions.width} 
        height={dimensions.height} 
        traceMode={traceMode} 
      />
      <Controls 
        traceMode={traceMode} 
        onToggleTraceMode={() => setTraceMode(!traceMode)}
        onRandomize={regenerate}
        onExport={handleExport}
        scale={scale}
        setScale={setScale}
        jitter={jitter}
        setJitter={setJitter}
      />
    </main>
  );
}
