
import React from 'react';
import { ArticulationGuide } from '../types';

// A visual component to simulate tongue position
const ArticulationVisualizer: React.FC<{ guide: ArticulationGuide }> = ({ guide }) => {
  // Simple logic to determine "Tongue" SVG path based on height/backness
  let tonguePath = "";
  
  // Helper to construct path
  // M startX,startY Q controlX,controlY endX,endY (Quadratic curve)
  
  if (guide.tongue_backness === 'front') {
     if (guide.tongue_height === 'high') tonguePath = "M 20,80 Q 40,20 60,40"; // High Front
     else if (guide.tongue_height === 'mid') tonguePath = "M 20,80 Q 50,50 80,55"; // Mid Front
     else tonguePath = "M 20,80 Q 60,70 90,70"; // Low Front
  } else if (guide.tongue_backness === 'central') {
     tonguePath = "M 20,80 Q 50,30 70,50"; // Retroflex/Central
  } else { // Back
     if (guide.tongue_height === 'high') tonguePath = "M 20,80 Q 60,20 90,30"; 
     else tonguePath = "M 20,80 Q 70,60 90,60";
  }

  // Lip shape indicator (circle for rounded, line for unrounded)
  const isRounded = guide.lip_shape === 'rounded';

  return (
    <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-90">
        {/* Throat/Mouth Profile Outline */}
        <path d="M 10,90 L 10,50 Q 10,10 50,10 Q 90,10 90,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600" />
        <path d="M 90,50 L 90,60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-600" />
        
        {/* Teeth */}
        <rect x="80" y="15" width="6" height="10" className="text-slate-300 dark:text-slate-500 fill-current" />
        <rect x="80" y="55" width="6" height="10" className="text-slate-300 dark:text-slate-500 fill-current" />

        {/* Tongue (Dynamic) */}
        <path d={tonguePath + " L 20,90 Z"} fill="currentColor" className="text-pink-400 dark:text-pink-600 opacity-80 transition-all duration-500 ease-in-out" />
        
        {/* Lips */}
        {isRounded ? (
           <circle cx="95" cy="40" r="4" className="text-rose-400 fill-current transition-all duration-500" />
        ) : (
           <line x1="92" y1="35" x2="92" y2="45" strokeWidth="3" stroke="currentColor" className="text-rose-400 transition-all duration-500" />
        )}

        {/* Airflow indicator (if fricative) */}
        {guide.airflow === 'fricative' && (
           <path d="M 85,35 L 100,35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,1" className="text-blue-400 animate-pulse" />
        )}
      </svg>
      <div className="absolute bottom-1 left-2 text-[10px] text-slate-400 font-mono bg-white/50 dark:bg-black/20 px-1 rounded">
        {guide.tongue_height} / {guide.tongue_backness}
      </div>
    </div>
  );
};

export default ArticulationVisualizer;
