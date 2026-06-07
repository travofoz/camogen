"use client";

import { useState, useEffect, useCallback } from 'react';
import CameraOverlay from '@/components/CameraOverlay';
import CamoCanvas from '@/components/CamoCanvas';
import Controls from '@/components/Controls';
import { generateSplinterPattern, Polygon } from '@/utils/camoEngine';
import { exportToSvg } from '@/utils/exportSvg';

export default function Home() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [traceMode, setTraceMode] = useState(true); 
  const [arMode, setArMode] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(65);
  const [jitter, setJitter] = useState(0.85);
  const [patternOffset, setPatternOffset] = useState({ x: 0, y: 0 });

  const regenerate = useCallback(() => {
    // Generate an enormously large pattern so you can pan across many surfaces
    const w = 4000;
    const h = 4000;
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
        arMode={arMode}
        patternOffset={patternOffset}
      />
      <Controls 
        traceMode={traceMode} 
        onToggleTraceMode={() => setTraceMode(!traceMode)}
        arMode={arMode}
        onToggleArMode={() => setArMode(!arMode)}
        onRandomize={regenerate}
        onExport={handleExport}
        scale={scale}
        setScale={setScale}
        jitter={jitter}
        setJitter={setJitter}
        patternOffset={patternOffset}
        setPatternOffset={setPatternOffset}
      />
    </main>
  );
}
