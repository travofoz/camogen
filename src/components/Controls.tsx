"use client";

import { useState } from 'react';

interface ControlsProps {
  traceMode: boolean;
  onToggleTraceMode: () => void;
  onRandomize: () => void;
  onExport: () => void;
  scale: number;
  setScale: (val: number) => void;
  jitter: number;
  setJitter: (val: number) => void;
}

export default function Controls({ 
  traceMode, 
  onToggleTraceMode, 
  onRandomize, 
  onExport,
  scale,
  setScale,
  jitter,
  setJitter
}: ControlsProps) {
  const [isOpen, setIsOpen] = useState(true);

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

          <button 
            onClick={onToggleTraceMode}
            className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${traceMode ? 'bg-[#5e7d43] text-white shadow-[#5e7d43]/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            {traceMode ? 'Trace Mode: ACTIVE' : 'Trace Mode: OFF'}
          </button>

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
