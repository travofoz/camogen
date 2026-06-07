"use client";

import { useState, useEffect, useCallback } from 'react';
import CameraOverlay from '@/components/CameraOverlay';
import CamoCanvas from '@/components/CamoCanvas';
import Controls from '@/components/Controls';
import { generateSplinterPattern, Polygon } from '@/utils/camoEngine';
import { exportToSvg } from '@/utils/exportSvg';

export default function Home() {
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [traceMode, setTraceMode] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const regenerate = useCallback(() => {
    // Generate a pattern large enough to cover most screens, but allow panning
    const w = Math.max(window.innerWidth, 1200);
    const h = Math.max(window.innerHeight, 1200);
    setDimensions({ width: w, height: h });
    setPolygons(generateSplinterPattern(w, h));
  }, []);

  useEffect(() => {
    // Initial generation on mount
    regenerate();
    
    const handleResize = () => {
      // Optional: Regenerate on resize if needed, but for now we just keep the canvas size
      // to avoid losing the current pattern. 
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [regenerate]);

  const handleExport = () => {
    exportToSvg(polygons, dimensions.width, dimensions.height);
  };

  if (polygons.length === 0) return null; // Avoid rendering until hydrated

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
      />
    </main>
  );
}
