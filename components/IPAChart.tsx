
import React, { useState } from 'react';
import { PHONEMES } from '../data/phonemes';
import { IPA_REFERENCE, IPA_CONSONANT_MAP, IPAReferenceItem } from '../data/ipaReference';
import ArticulationVisualizer from './ArticulationVisualizer';
import { ChevronRight, BookOpen, Lock, X } from 'lucide-react';

interface IPAChartProps {
  onSelect: (phoneme: string, prompt: string) => void;
}

const IPAChart: React.FC<IPAChartProps> = ({ onSelect }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // Helper to find if we have interactive practice support for this symbol (from phonemes.ts)
  // Note: PHONEMES uses some non-standard symbols like 'r' for 'ɹ' or 'a' for 'æ' sometimes, 
  // so exact matching might be tricky. Here we assume exact symbol match.
  const getPracticeData = (symbol: string) => PHONEMES.find(p => p.symbol === symbol);
  
  // Helper to get reference data (fallback if practice data not available)
  const getReferenceData = (symbol: string) => IPA_REFERENCE[symbol];

  // Expanded Grid Structure for Consonants
  const places = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'];
  const manners = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'lateral-fricative', 'approximant', 'lateral-approximant'];
  
  const placeLabels: Record<string, string> = {
    bilabial: 'Bilabial', labiodental: 'Labio-\ndental', dental: 'Dental', 
    alveolar: 'Alveolar', postalveolar: 'Post-\nalv.', retroflex: 'Retro-\nflex',
    palatal: 'Palatal', velar: 'Velar', uvular: 'Uvular', pharyngeal: 'Pharyn-\ngeal', glottal: 'Glottal'
  };
  
  const mannerLabels: Record<string, string> = {
    plosive: 'Plosive', nasal: 'Nasal', trill: 'Trill', tap: 'Tap/Flap',
    fricative: 'Fricative', 'lateral-fricative': 'Lat. Fric.', 
    approximant: 'Approx.', 'lateral-approximant': 'Lat. App.'
  };

  // Full Vowel Grid (Trapezoid Logic)
  const vowelGrid = [
    // Close
    { h: 'close', b: 'front', label: 'i' }, { h: 'close', b: 'front-r', label: 'y' },
    { h: 'close', b: 'central', label: 'ɨ' }, { h: 'close', b: 'central-r', label: 'ʉ' },
    { h: 'close', b: 'back', label: 'ɯ' }, { h: 'close', b: 'back-r', label: 'u' },
    
    // Near-close
    { h: 'near-close', b: 'front', label: 'ɪ' }, { h: 'near-close', b: 'front-r', label: 'ʏ' },
    { h: 'near-close', b: 'back', label: 'ʊ' }, // often placed near back

    // Close-mid
    { h: 'close-mid', b: 'front', label: 'e' }, { h: 'close-mid', b: 'front-r', label: 'ø' },
    { h: 'close-mid', b: 'central', label: 'ɘ' }, { h: 'close-mid', b: 'central-r', label: 'ɵ' },
    { h: 'close-mid', b: 'back', label: 'ɤ' }, { h: 'close-mid', b: 'back-r', label: 'o' },

    // Mid
    { h: 'mid', b: 'central', label: 'ə' },

    // Open-mid
    { h: 'open-mid', b: 'front', label: 'ɛ' }, { h: 'open-mid', b: 'front-r', label: 'œ' },
    { h: 'open-mid', b: 'central', label: 'ɜ' }, { h: 'open-mid', b: 'central-r', label: 'ɞ' },
    { h: 'open-mid', b: 'back', label: 'ʌ' }, { h: 'open-mid', b: 'back-r', label: 'ɔ' },

    // Near-open
    { h: 'near-open', b: 'front', label: 'æ' }, { h: 'near-open', b: 'central', label: 'ɐ' },

    // Open
    { h: 'open', b: 'front', label: 'a' }, { h: 'open', b: 'front-r', label: 'ɶ' },
    { h: 'open', b: 'back', label: 'ɑ' }, { h: 'open', b: 'back-r', label: 'ɒ' },
  ];

  const activePracticeData = selectedSymbol ? getPracticeData(selectedSymbol) : null;
  const activeRefData = selectedSymbol ? getReferenceData(selectedSymbol) : null;
  
  // If we have neither practice nor ref data (e.g., rare symbols not in map), we treat as unsupported
  const hasData = !!activePracticeData || !!activeRefData;

  const renderCell = (symbol: string) => {
    if (!symbol) return null;

    // Check if this symbol exists in our reference or practice data
    // Some symbols might be in the map but not in the reference list if we kept the list short
    const isReference = !!IPA_REFERENCE[symbol];
    const isPractice = !!getPracticeData(symbol);
    
    const isSelected = selectedSymbol === symbol;

    if (!isReference && !isPractice) {
       // Render unclickable/dimmed if we strictly don't have info, 
       // OR render as reference-only if we just want to show it exists in the chart but no data.
       // For now, let's render it but it might show "No data" in panel.
       return (
         <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-slate-300 dark:text-slate-700 font-serif select-none">
            {symbol}
         </div>
       );
    }

    return (
      <button
        onClick={() => setSelectedSymbol(symbol)}
        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md text-base md:text-lg font-serif transition-all duration-200 border
          ${isSelected 
            ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 dark:ring-indigo-900 border-transparent scale-110 z-10 shadow-md' 
            : isPractice
              ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 hover:shadow-sm' 
              : 'bg-slate-50 dark:bg-slate-800/40 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
        `}
      >
        {symbol}
      </button>
    );
  };

  // Helper to get symbols for grid cell
  const getConsonantSymbols = (place: string, manner: string) => {
     const key = `${place}-${manner}`;
     return IPA_CONSONANT_MAP[key] || [];
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in w-full max-w-6xl mx-auto relative">
      
      {/* LEFT: The Charts Area */}
      <div className="flex-1 space-y-6 overflow-x-auto">
        
        {/* Consonants Section */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[800px]">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded text-xs font-bold uppercase tracking-wider">Consonants</span>
             <span className="text-xs text-slate-400">(Pulmonic)</span>
          </div>
          
          <div className="grid grid-cols-[auto_repeat(11,1fr)] gap-1">
             {/* Header Row */}
             <div className="col-start-1"></div>
             {places.map(p => (
                <div key={p} className="text-[9px] uppercase font-bold text-center text-slate-400 whitespace-pre-line leading-tight self-end pb-2">
                   {placeLabels[p]}
                </div>
             ))}

             {/* Rows */}
             {manners.map(m => (
               <React.Fragment key={m}>
                 <div className="text-[9px] uppercase font-bold text-slate-400 flex items-center justify-end pr-2 h-10">
                   {mannerLabels[m]}
                 </div>
                 {places.map(p => {
                    const symbols = getConsonantSymbols(p, m);
                    // Standard IPA chart often puts Voiceless Left, Voiced Right in a cell
                    return (
                      <div key={`${p}-${m}`} className={`flex justify-center items-center h-10 ${symbols.length > 0 ? 'bg-slate-100/50 dark:bg-slate-700/20' : ''} rounded`}>
                         {symbols.length > 0 && (
                            <div className="flex gap-1 md:gap-2 px-1">
                               {symbols.map(sym => (
                                  <React.Fragment key={sym}>{renderCell(sym)}</React.Fragment>
                               ))}
                            </div>
                         )}
                      </div>
                    );
                 })}
               </React.Fragment>
             ))}
          </div>
        </div>

        {/* Vowels Section */}
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-[500px]">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded text-xs font-bold uppercase tracking-wider">Vowels</span>
          </div>
          
          <div className="relative w-full max-w-lg mx-auto h-[300px] my-4 select-none">
             {/* Trapezoid Background */}
             <svg className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-600 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 10,10 L 90,10 L 70,90 L 30,90 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="36" x2="83" y2="36" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="25" y1="63" x2="76" y2="63" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                
                <text x="2" y="12" fontSize="3" fill="currentColor" className="font-bold">CLOSE</text>
                <text x="22" y="90" fontSize="3" fill="currentColor" className="font-bold">OPEN</text>
                <text x="10" y="5" fontSize="3" fill="currentColor" className="font-bold">FRONT</text>
                <text x="85" y="5" fontSize="3" fill="currentColor" className="font-bold">BACK</text>
             </svg>

             {/* Vowel Placement Logic */}
             {vowelGrid.map((v) => {
                // Vertical position
                let top = 10; // close
                if (v.h === 'near-close') top = 23;
                if (v.h === 'close-mid') top = 36;
                if (v.h === 'mid') top = 50;
                if (v.h === 'open-mid') top = 63;
                if (v.h === 'near-open') top = 76;
                if (v.h === 'open') top = 90;

                // Horizontal position (simplified approximation for trapezoid width)
                // Width at top (10% to 90%) = 80% width
                // Width at bottom (30% to 70%) = 40% width
                // Slope factor based on 'top' %
                const yFactor = (top - 10) / 80; // 0 at top, 1 at bottom
                const leftEdge = 10 + (20 * yFactor);
                const rightEdge = 90 - (20 * yFactor);
                const rowWidth = rightEdge - leftEdge;

                let left = 50;
                
                // Front/Back Logic relative to row width
                if (v.b.startsWith('front')) left = leftEdge;
                else if (v.b.startsWith('central')) left = leftEdge + (rowWidth * 0.5);
                else if (v.b.startsWith('back')) left = rightEdge;
                
                // Adjust for rounded pairs (usually right side of dot)
                if (v.b.endsWith('-r')) left += 3; // nudge right

                return (
                   <div key={v.label} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top: `${top}%`, left: `${left}%` }}>
                      {renderCell(v.label)}
                   </div>
                );
             })}
          </div>
        </div>

      </div>

      {/* RIGHT: Detail Panel (Overlay on mobile, Sticky on Desktop) */}
      {selectedSymbol && (
        <div className={`fixed inset-0 bg-black/20 z-40 lg:hidden`} onClick={() => setSelectedSymbol(null)}></div>
      )}
      
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:relative lg:transform-none lg:w-80 lg:shadow-none lg:bg-transparent lg:translate-x-0 ${selectedSymbol ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
         <div className="h-full overflow-y-auto lg:sticky lg:top-24 lg:bg-white lg:dark:bg-slate-800 lg:rounded-3xl lg:border lg:border-indigo-100 lg:dark:border-indigo-900/50 lg:max-h-[calc(100vh-8rem)]">
            
            {hasData ? (
               <div className="p-6 flex flex-col h-full animate-in fade-in slide-in-from-right-4">
                  <button 
                     onClick={() => setSelectedSymbol(null)} 
                     className="lg:hidden absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full"
                  >
                     <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-4 mb-6 mt-2 lg:mt-0">
                     <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-serif font-bold shadow-lg ${
                        activePracticeData 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                     }`}>
                        {activePracticeData?.symbol || activeRefData?.symbol}
                     </div>
                     <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                           {activePracticeData?.label.split(' (')[0] || activeRefData?.symbol}
                        </h2>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mt-1">
                           {activeRefData?.name || 'Phoneme'}
                        </p>
                        {activeRefData?.voice && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                                {activeRefData.voice}
                            </span>
                        )}
                     </div>
                  </div>

                  {activePracticeData ? (
                     <div className="mb-6">
                        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                             <ArticulationVisualizer guide={activePracticeData.guide} />
                        </div>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                           {activePracticeData.guide.description}
                        </p>
                     </div>
                  ) : (
                     <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           Visual guide not available.
                        </p>
                        {activeRefData?.description && (
                            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-200 dark:border-slate-800 pt-3">
                               {activeRefData.description}
                            </p>
                        )}
                     </div>
                  )}

                  <div className="space-y-2 mb-8 flex-1">
                     <p className="text-xs font-bold uppercase text-slate-400">Example Words</p>
                     <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        {activePracticeData ? (
                           <div className="space-y-1">
                               <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                                  "{activePracticeData.prompt.split('\n')[0].replace('Word: ', '')}"
                               </p>
                           </div>
                        ) : (
                           <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                              {activeRefData?.example}
                           </p>
                        )}
                     </div>
                  </div>

                  {activePracticeData ? (
                     <button 
                        onClick={() => onSelect(activePracticeData.symbol, activePracticeData.prompt)}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] mb-4 lg:mb-0"
                     >
                        Practice Sound <ChevronRight className="w-4 h-4" />
                     </button>
                  ) : (
                     <button 
                        disabled
                        className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200 dark:border-slate-700 mb-4 lg:mb-0"
                     >
                        <Lock className="w-4 h-4" /> Practice Coming Soon
                     </button>
                  )}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-50 min-h-[400px] p-6">
                  <div className="text-6xl mb-6 grayscale opacity-20">🗺️</div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Interactive IPA Chart</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                     Select any symbol from the chart to view its details, articulation, and examples.
                  </p>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};

export default IPAChart;
