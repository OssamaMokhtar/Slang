
import React, { useState } from 'react';
import { Info, ChevronRight, Keyboard, Map } from 'lucide-react';
import { PHONEMES, PhonemeData } from '../data/phonemes';
import ArticulationVisualizer from './ArticulationVisualizer';

interface PhonemeSelectorProps {
  onSelect: (phoneme: string, prompt: string) => void;
  onViewChart?: () => void;
  phonemes?: PhonemeData[];
}

const PhonemeSelector: React.FC<PhonemeSelectorProps> = ({ onSelect, onViewChart, phonemes }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Use provided phonemes or default to imported list.
  // If phonemes is passed as an empty array (as in App.tsx currently), we fallback to PHONEMES
  // to ensure the UI isn't empty until the parent component implements actual filtering.
  const data = (phonemes && phonemes.length > 0) ? phonemes : PHONEMES;

  const vowels = data.filter(p => p.category === 'vowel');
  const consonants = data.filter(p => p.category === 'consonant');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* Quick IPA Keyboard */}
      <div className="bg-slate-100/80 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
            <Keyboard className="w-4 h-4" /> IPA Quick Select
          </div>
          {onViewChart && (
            <button 
              onClick={onViewChart}
              className="text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <Map className="w-3 h-3" /> View Full Chart
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Vowels Row */}
          {vowels.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-16">Vowels</span>
              {vowels.map(p => (
                <button 
                  key={p.symbol}
                  onClick={() => onSelect(p.symbol, p.prompt)}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-slate-700 dark:text-slate-200 font-serif font-bold shadow-sm hover:shadow-md transition-all"
                  title={p.label}
                >
                  {p.symbol}
                </button>
              ))}
            </div>
          )}

          {/* Consonants Row */}
          {consonants.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-16">Consonants</span>
              {consonants.map(p => (
                <button 
                  key={p.symbol}
                  onClick={() => onSelect(p.symbol, p.prompt)}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 font-serif font-bold shadow-sm hover:shadow-md transition-all"
                  title={p.label}
                >
                  {p.symbol}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((p) => {
          const isActive = activeId === p.symbol;
          return (
            <div
              key={p.symbol}
              onClick={() => setActiveId(p.symbol)}
              className={`relative overflow-hidden group cursor-pointer rounded-2xl transition-all duration-300 border ${
                 isActive 
                   ? 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl scale-[1.02]' 
                   : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg'
              }`}
            >
              <div className="p-5 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xl font-serif font-bold text-indigo-600 dark:text-indigo-400">
                  {p.symbol}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{p.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">"{p.prompt.split('\n')[0].replace('Word: ', '')}"</p>
                </div>
                
                {/* Expandable Visual Guide */}
                {isActive && (
                   <div className="w-full mt-2 animate-in zoom-in duration-300">
                      <ArticulationVisualizer guide={p.guide} />
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-700">
                         <Info className="w-3 h-3 inline mr-1 -mt-0.5 text-indigo-500" />
                         {p.guide.description}
                      </p>
                      <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(p.symbol, p.prompt);
                        }}
                        className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        Practice <ChevronRight className="w-3 h-3" />
                      </button>
                   </div>
                )}

                {!isActive && (
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-indigo-500 font-medium mt-2">
                      Tap to view guide
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhonemeSelector;
