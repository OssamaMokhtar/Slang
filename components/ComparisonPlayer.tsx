
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, User, Bot } from 'lucide-react';
import { generateTTS } from '../services/geminiService';
import { playPCM } from '../services/audioUtils';

interface ComparisonPlayerProps {
  userAudioBlob: Blob | null;
  modelText: string;
  isDarkMode: boolean;
}

const ComparisonPlayer: React.FC<ComparisonPlayerProps> = ({ userAudioBlob, modelText, isDarkMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSource, setActiveSource] = useState<'user' | 'model' | null>(null);
  const [isLoadingTTS, setIsLoadingTTS] = useState(false);
  
  // We store the TTS data so we don't fetch it every time
  const [ttsAudioBase64, setTtsAudioBase64] = useState<string | null>(null);
  
  const loopRef = useRef<boolean>(false);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (userAudioBlob) {
      const url = URL.createObjectURL(userAudioBlob);
      userAudioRef.current = new Audio(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [userAudioBlob]);

  const fetchTTS = async () => {
    if (ttsAudioBase64) return ttsAudioBase64;
    setIsLoadingTTS(true);
    try {
      const data = await generateTTS(modelText);
      setTtsAudioBase64(data);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setIsLoadingTTS(false);
    }
  };

  const playSequence = async () => {
    if (!userAudioRef.current) return;
    
    // 1. Play User
    setActiveSource('user');
    await userAudioRef.current.play();
    
    await new Promise<void>(resolve => {
      if (!userAudioRef.current) return resolve();
      userAudioRef.current.onended = () => resolve();
    });

    if (!isPlaying && !loopRef.current) {
       setActiveSource(null);
       return;
    }

    // 2. Play Model
    setActiveSource('model');
    const ttsData = await fetchTTS();
    if (ttsData && (isPlaying || loopRef.current)) {
       await playPCM(ttsData);
    }

    // 3. Loop or Stop
    if (loopRef.current && isPlaying) {
       setTimeout(playSequence, 500); // Small gap
    } else {
       setIsPlaying(false);
       setActiveSource(null);
    }
  };

  const toggleLoop = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      loopRef.current = false;
      userAudioRef.current?.pause();
      setActiveSource(null);
    } else {
      setIsPlaying(true);
      loopRef.current = true;
      playSequence();
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Volume2 className="w-4 h-4" /> Comparison Loop
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Hear the difference
        </span>
      </div>

      <div className="flex gap-2 h-24 mb-4">
        {/* User Visual */}
        <div className={`flex-1 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
          activeSource === 'user' 
            ? 'bg-white dark:bg-slate-800 shadow-lg scale-105 border-indigo-500 border-2' 
            : 'bg-slate-50 dark:bg-slate-800/50 opacity-60'
        }`}>
          <div className={`p-2 rounded-full mb-2 ${activeSource === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
             <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold">You</span>
        </div>

        {/* Model Visual */}
        <div className={`flex-1 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
          activeSource === 'model' 
            ? 'bg-white dark:bg-slate-800 shadow-lg scale-105 border-purple-500 border-2' 
            : 'bg-slate-50 dark:bg-slate-800/50 opacity-60'
        }`}>
           <div className={`p-2 rounded-full mb-2 ${activeSource === 'model' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-400'}`}>
             {isLoadingTTS ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
          </div>
          <span className="text-xs font-semibold">Native Model</span>
        </div>
      </div>

      <button
        onClick={toggleLoop}
        className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
          isPlaying 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
            : 'bg-slate-900 dark:bg-indigo-600 text-white hover:shadow-md'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4 fill-current" /> Stop Comparison
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" /> Start A/B Loop
          </>
        )}
      </button>
    </div>
  );
};

export default ComparisonPlayer;
