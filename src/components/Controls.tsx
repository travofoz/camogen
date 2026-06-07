"use client";

import { useState } from 'react';

interface ControlsProps {
  traceMode: boolean;
  onToggleTraceMode: () => void;
  arMode: boolean;
  onToggleArMode: () => void;
  autoSnap: boolean;
  onToggleAutoSnap: () => void;
  onRandomize: () => void;
  onExport: () => void;
  scale: number;
  setScale: (val: number) => void;
  jitter: number;
  setJitter: (val: number) => void;
  patternOffset: { x: number, y: number };
  setPatternOffset: (val: { x: number, y: number }) => void;
}

export default function Controls({ 
  traceMode, 
  onToggleTraceMode, 
  arMode,
  onToggleArMode,
  autoSnap,
  onToggleAutoSnap,
  onRandomize, 
  onExport,
  scale,
  setScale,
  jitter,
  setJitter,
  patternOffset,
  setPatternOffset
}: ControlsProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Shift by roughly the width of a typical face (e.g. 500px)
  const shiftPattern = (dx: number, dy: number) => {
    setPatternOffset({
      x: patternOffset.x + dx * 500,
      y: patternOffset.y + dy * 500
    });
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md">
      <div className={`backdrop-blur-xl bg-black/70 border border-white/20 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none absolute'}`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5e7d43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
            M90 Engine
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white transition bg-white/5 p-1.5 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-5">
          <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-white/70 uppercase tracking-wider">
                <label>Pattern Scale</label>
                <span className="text-[#5e7d43]">{scale}px</span>
              </div>
              <input 
                type="range" 
                min="35" 
                max="150" 
                value={scale} 
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-[#5e7d43]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-white/70 uppercase tracking-wider">
                <label>Edge Jitter</label>
                <span className="text-[#5e7d43]">{jitter.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.4" 
                step="0.05"
                value={jitter} 
                onChange={(e) => setJitter(Number(e.target.value))}
                className="w-full accent-[#5e7d43]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onToggleTraceMode}
              className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm ${traceMode ? 'bg-[#5e7d43] text-white shadow-[#5e7d43]/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              Trace
            </button>
            <button 
              onClick={onToggleArMode}
              className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm ${arMode ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              AR Warp
            </button>
          </div>

          {arMode && (
            <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-500/30 flex flex-col items-center gap-4">
              <button 
                onClick={onToggleAutoSnap}
                className={`w-full py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm ${autoSnap ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                {autoSnap ? 'OpenCV Auto-Snap: ON' : 'OpenCV Auto-Snap: OFF'}
              </button>

              <div className="w-full h-px bg-white/10" />

              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">Shift Pattern to Adjacent Face</span>
                <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                  <div />
                  <button onClick={() => shiftPattern(0, -1)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex justify-center">⬆️</button>
                  <div />
                  <button onClick={() => shiftPattern(-1, 0)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex justify-center">⬅️</button>
                  <div className="flex items-center justify-center text-xs text-blue-200/50">Face</div>
                  <button onClick={() => shiftPattern(1, 0)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex justify-center">➡️</button>
                  <div />
                  <button onClick={() => shiftPattern(0, 1)} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg flex justify-center">⬇️</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              onClick={onRandomize}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-medium transition-colors text-sm"
            >
              Regenerate
            </button>
            <button 
              onClick={onExport}
              className="flex-1 bg-white hover:bg-gray-200 text-black py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export SVG
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-black/70 border border-[#5e7d43]/50 text-white px-6 py-3 rounded-full font-bold shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:bg-black transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5e7d43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
          Controls
        </button>
      )}
    </div>
  );
}
