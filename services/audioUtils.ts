
/**
 * Converts a Blob to a Base64 string (stripping the data URL prefix).
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Creates a visualizer data array from an audio stream (mock implementation for UI).
 * In a real app, we would use AnalyserNode.
 */
export const generateVisualizerData = (length: number): number[] => {
  return Array.from({ length }, () => Math.random() * 0.5 + 0.2);
};

/**
 * Helper to play audio blob
 */
export const playAudioBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
};

/**
 * Decodes an audio blob into an AudioBuffer for visualization.
 */
export const getAudioBuffer = async (blob: Blob): Promise<AudioBuffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  return await audioContext.decodeAudioData(arrayBuffer);
};

/**
 * Helper to decode base64 string to Uint8Array
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes and plays raw PCM data from a base64 string (from Gemini TTS).
 * Assumes 24kHz mono, which is typical for the Gemini 2.5 Flash TTS model.
 */
export const playPCM = async (base64Audio: string): Promise<void> => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContextClass({sampleRate: 24000});
  
  try {
    const bytes = decodeBase64(base64Audio);

    // The raw PCM from Gemini is typically 16-bit Little Endian.
    const dataInt16 = new Int16Array(bytes.buffer);
    
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < dataInt16.length; i++) {
      // Normalize Int16 to Float32 [-1.0, 1.0]
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();

    return new Promise((resolve) => {
      source.onended = () => {
        resolve();
        ctx.close();
      };
    });
  } catch (e) {
    console.error("Error playing PCM", e);
    ctx.close();
  }
};
