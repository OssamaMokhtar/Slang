import React, { useEffect, useRef, useState } from 'react';
import { AnalysisResponse, PhonemeError } from '../types';
import { getAudioBuffer } from '../services/audioUtils';

interface WaveformProps {
  isRecording?: boolean;
  audioBlob?: Blob | null;
  analysis?: AnalysisResponse | null;
  onSeek?: (time: number) => void;
  currentTime?: number;
  highlightedError?: PhonemeError | null;
  isDarkMode?: boolean;
}

const Waveform: React.FC<WaveformProps> = ({ 
  isRecording, 
  audioBlob, 
  analysis, 
  onSeek,
  currentTime = 0,
  highlightedError,
  isDarkMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  // Decode audio blob when provided
  useEffect(() => {
    if (audioBlob) {
      getAudioBuffer(audioBlob).then(setAudioBuffer).catch(err => {
        console.error("Failed to decode audio for waveform", err);
      });
    } else {
      setAudioBuffer(null);
    }
  }, [audioBlob]);

  // Handle click to seek
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioBuffer || !onSeek || isRecording) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const duration = audioBuffer.duration;
    // Clamp time
    const time = Math.max(0, Math.min(duration, (x / canvas.width) * duration));
    
    onSeek(time);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    // Drawing function
    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // 1. RECORDING MODE: Animated Sine Wave
      if (isRecording) {
        ctx.clearRect(0, 0, width, height);
        // Bg for recording
        ctx.fillStyle = isDarkMode ? '#0f172a' : '#f8fafc'; 
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x < width; x++) {
          // Composite sine wave
          const y = height / 2 + 
            (Math.sin((x + offset) * 0.05) * 15) * (Math.sin((x + offset) * 0.01) * 0.5 + 0.5) +
            (Math.random() * 2 - 1);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = isDarkMode ? '#818cf8' : '#6366f1'; // Indigo-400/500
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.stroke();

        offset += 4; // Speed
        animationFrameId = requestAnimationFrame(draw);
      } 
      // 2. ANALYSIS RESULT MODE: Static Waveform with Highlights
      else if (audioBuffer && analysis) {
        ctx.clearRect(0, 0, width, height);

        // A. Background Zones (Green for good, Red/Orange for errors)
        // Default background: Correct Zone
        ctx.fillStyle = isDarkMode ? '#064e3b' : '#dcfce7'; // green-900 : green-100
        ctx.fillRect(0, 0, width, height);

        const duration = audioBuffer.duration;
        const pixelsPerSecond = width / duration;

        // Draw Error Zones
        analysis.phoneme_errors.forEach(error => {
          const startX = Math.max(0, error.start_ts * pixelsPerSecond);
          const endX = Math.min(width, error.end_ts * pixelsPerSecond);
          const w = Math.max(endX - startX, 4); // Minimum width 4px

          // Confidence check for Orange (Suspect) vs Red (Error)
          const isSuspect = error.confidence < 0.8; 
          
          // If this is the highlighted error, draw slightly darker/different
          if (highlightedError === error) {
             ctx.fillStyle = isSuspect 
               ? (isDarkMode ? '#b45309' : '#fbbf24')  // Amber darker
               : (isDarkMode ? '#991b1b' : '#f87171'); // Red darker
          } else {
             ctx.fillStyle = isSuspect 
               ? (isDarkMode ? '#78350f' : '#fef3c7')  // Amber-900 : Amber-100
               : (isDarkMode ? '#7f1d1d' : '#fee2e2'); // Red-900 : Red-100
          }
          
          ctx.fillRect(startX, 0, w, height);
        });

        // B. Draw Waveform
        const data = audioBuffer.getChannelData(0);
        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let i = 0; i < width; i++) {
          let min = 1.0;
          let max = -1.0;
          for (let j = 0; j < step; j++) {
            const datum = data[i * step + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }
          // Draw vertical bar for this pixel
          const x = i;
          const yLow = (1 + min) * amp;
          const yHigh = (1 + max) * amp;
          
          ctx.moveTo(x, yLow);
          ctx.lineTo(x, yHigh);
        }

        ctx.strokeStyle = isDarkMode ? '#e2e8f0' : '#475569'; // Slate-200 : Slate-600
        ctx.lineWidth = 1;
        ctx.stroke();

        // C. Draw Error Markers (Text/Lines) on top
        analysis.phoneme_errors.forEach(error => {
           const startX = Math.max(0, error.start_ts * pixelsPerSecond);
           const endX = Math.min(width, error.end_ts * pixelsPerSecond);
           
           const isSuspect = error.confidence < 0.8;
           
           // Underline
           ctx.beginPath();
           ctx.moveTo(startX, height - 2);
           ctx.lineTo(endX, height - 2);
           ctx.strokeStyle = isSuspect 
             ? (isDarkMode ? '#f59e0b' : '#d97706') // Amber-500 : Amber-600
             : (isDarkMode ? '#ef4444' : '#dc2626'); // Red-500 : Red-600
           ctx.lineWidth = highlightedError === error ? 4 : 2;
           ctx.stroke();
        });

        // D. Draw Playback Cursor
        if (currentTime > 0 && currentTime <= duration) {
           const cursorX = currentTime * pixelsPerSecond;
           ctx.beginPath();
           ctx.moveTo(cursorX, 0);
           ctx.lineTo(cursorX, height);
           ctx.strokeStyle = isDarkMode ? '#a5b4fc' : '#312e81'; // Indigo-300 : Indigo-900
           ctx.lineWidth = 2;
           ctx.stroke();
        }

      }
      // 3. IDLE MODE
      else {
        ctx.clearRect(0, 0, width, height);
        // Fill bg for idle
        ctx.fillStyle = isDarkMode ? '#1e293b' : '#ffffff'; // Slate-800 : White
        ctx.fillRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = isDarkMode ? '#475569' : '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    // Only animate if recording or if we need to update cursor continuously (handled by prop updates mostly)
    // But for recording we definitely need RAF.
    // For playback cursor, we rely on parent passing new `currentTime` which triggers useEffect.
    if (isRecording) {
        draw();
    } else {
        draw(); // One-shot draw when props change
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isRecording, audioBuffer, analysis, currentTime, highlightedError, isDarkMode]);

  return (
    <div className="relative w-full group">
      <canvas 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        width={800} 
        height={100} 
        className={`w-full h-24 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 block ${onSeek ? 'cursor-crosshair' : ''}`}
      />
      {analysis && (
        <div className="flex flex-wrap gap-4 justify-between mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex gap-4">
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600"></span> Correct</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-200 dark:bg-amber-800 border border-amber-400 dark:border-amber-600"></span> Suspect</div>
             <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-200 dark:bg-red-800 border border-red-400 dark:border-red-600"></span> Error</div>
          </div>
          {onSeek && <div className="text-indigo-500 dark:text-indigo-400 animate-pulse">Tap waveform to play segments</div>}
        </div>
      )}
    </div>
  );
};

export default Waveform;