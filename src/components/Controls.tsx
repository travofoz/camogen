"use client";

import { useState } from 'react';

interface ControlsProps {
  traceMode: boolean;
  onToggleTraceMode: () => void;
  onRandomize: () => void;
  onExport: () => void;
}

export default function Controls({ traceMode, onToggleTraceMode, onRandomize, onExport }: ControlsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md">
      <div className={`backdrop-blur-xl bg-black/60 border border-white/10 p-5 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none absolute'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold tracking-wide">M90 Engine</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onToggleTraceMode}
            className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${traceMode ? 'bg-[#5e7d43] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12"/></svg>
            {traceMode ? 'Trace Mode: ON' : 'Trace Mode: OFF'}
          </button>

          <div className="flex gap-3">
            <button 
              onClick={onRandomize}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Regenerate
            </button>
            <button 
              onClick={onExport}
              className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-xl font-medium transition-colors"
            >
              Export SVG
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-black/60 border border-white/10 text-white px-6 py-3 rounded-full font-medium shadow-xl hover:bg-black/80 transition"
        >
          Open Controls
        </button>
      )}
    </div>
  );
}
