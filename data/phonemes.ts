
import { ArticulationGuide } from '../types';

export interface PhonemeData {
  symbol: string;
  label: string;
  prompt: string;
  guide: ArticulationGuide;
  category?: 'vowel' | 'consonant';
  // IPA Classification for Chart Mapping
  place?: 'bilabial' | 'labiodental' | 'dental' | 'alveolar' | 'postalveolar' | 'palatal' | 'velar' | 'glottal';
  manner?: 'plosive' | 'nasal' | 'fricative' | 'affricate' | 'liquid' | 'glide' | 'tap' | 'trill';
  vowelHeight?: 'high' | 'mid' | 'low' | 'near-close';
  vowelBackness?: 'front' | 'central' | 'back';
  language?: string; // Optional, defaults to 'English' if undefined or logic handles it
}

export const PHONEMES: PhonemeData[] = [
  // ENGLISH PHONEMES
  { 
    symbol: 'θ', 
    label: 'th (thin)', 
    prompt: "Word: Thank\nPhrase: Think three thoughts\nSentence: I think the three thin thieves went north.",
    category: 'consonant',
    place: 'dental',
    manner: 'fricative',
    language: 'English',
    guide: {
      tongue_height: 'mid',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'fricative',
      description: "Place the tip of your tongue lightly between your upper and lower teeth. Blow air gently through the gap."
    }
  },
  { 
    symbol: 'ð', 
    label: 'th (this)', 
    prompt: "Word: There\nPhrase: This and that\nSentence: My mother and father breathe in the smooth weather.",
    category: 'consonant',
    place: 'dental',
    manner: 'fricative',
    language: 'English',
    guide: {
      tongue_height: 'mid',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'fricative',
      description: "Same position as 'thin', but use your voice box. You should feel a vibration on your tongue."
    }
  },
  { 
    symbol: 'r', 
    label: 'r (run)', 
    prompt: "Word: Red\nPhrase: A really right road\nSentence: The red rabbit ran across the river rapidly.",
    category: 'consonant',
    place: 'postalveolar',
    manner: 'liquid',
    language: 'English',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'central',
      lip_shape: 'rounded',
      airflow: 'liquid',
      description: "Curl the tip of your tongue back slightly, but don't touch the roof of your mouth. Round your lips."
    }
  },
  { 
    symbol: 'l', 
    label: 'l (light)', 
    prompt: "Word: Level\nPhrase: A little late\nSentence: Lily likes looking at the lovely yellow lemon.",
    category: 'consonant',
    place: 'alveolar',
    manner: 'liquid',
    language: 'English',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'liquid',
      description: "Touch the tip of your tongue to the bumpy ridge just behind your upper teeth. Let air flow around the sides."
    }
  },
  { 
    symbol: 'v', 
    label: 'v (very)', 
    prompt: "Word: Voice\nPhrase: A very vast view\nSentence: Seven visitors drove the van to the valley.",
    category: 'consonant',
    place: 'labiodental',
    manner: 'fricative',
    language: 'English',
    guide: {
      tongue_height: 'low',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'fricative',
      description: "Gently bite your lower lip with your upper teeth. Push air through and vibrate your vocal cords."
    }
  },
  { 
    symbol: 'w', 
    label: 'w (wait)', 
    prompt: "Word: Water\nPhrase: A wide white window\nSentence: We wondered where the white whale went in winter.",
    category: 'consonant',
    place: 'bilabial',
    manner: 'glide',
    language: 'English',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'back',
      lip_shape: 'rounded',
      airflow: 'glide',
      description: "Round your lips into a small circle like you are blowing a kiss. Raise the back of your tongue."
    }
  },
  { 
    symbol: 'æ', 
    label: 'a (cat)', 
    prompt: "Word: Apple\nPhrase: A black hat\nSentence: The man with the black hat sat on the mat.",
    category: 'vowel',
    vowelHeight: 'low',
    vowelBackness: 'front',
    language: 'English',
    guide: {
      tongue_height: 'low',
      tongue_backness: 'front',
      lip_shape: 'unrounded',
      airflow: 'stop', 
      description: "Drop your jaw low and push your tongue forward. The tip should touch the back of your bottom teeth."
    }
  },
  { 
    symbol: 'i:', 
    label: 'ee (see)', 
    prompt: "Word: Keep\nPhrase: Sweet green tea\nSentence: We need to keep the sweet cheese in the breeze.",
    category: 'vowel',
    vowelHeight: 'high',
    vowelBackness: 'front',
    language: 'English',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'front',
      lip_shape: 'unrounded',
      airflow: 'stop',
      description: "Smile widely! Raise your tongue very high towards the roof of your mouth without touching it."
    }
  },
  { 
    symbol: 'ɪ', 
    label: 'i (sit)', 
    prompt: "Word: Sit\nPhrase: A bit of wit\nSentence: The kitten sits in the little kitchen.",
    category: 'vowel',
    vowelHeight: 'near-close',
    vowelBackness: 'front',
    language: 'English',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'front',
      lip_shape: 'unrounded',
      airflow: 'stop',
      description: "Relax your jaw slightly compared to /i:/. Your tongue is high but not tense."
    }
  },
  { 
    symbol: 'ʊ', 
    label: 'u (put)', 
    prompt: "Word: Put\nPhrase: A good book\nSentence: He took a look at the good cookbook.",
    category: 'vowel',
    vowelHeight: 'near-close',
    vowelBackness: 'back',
    language: 'English',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'back',
      lip_shape: 'rounded',
      airflow: 'stop',
      description: "Slightly round your lips. Keep your tongue high and back, but relaxed."
    }
  },

  // SPANISH PHONEMES
  {
    symbol: 'r',
    label: 'r (pero)',
    prompt: "Word: Pero\nPhrase: Para mi\nSentence: Mira la cara del toro.",
    category: 'consonant',
    place: 'alveolar',
    manner: 'tap',
    language: 'Spanish',
    guide: {
      tongue_height: 'mid',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'stop',
      description: "Tap the tip of your tongue quickly against the alveolar ridge (behind teeth)."
    }
  },
  {
    symbol: 'rr',
    label: 'rr (perro)',
    prompt: "Word: Perro\nPhrase: Carro rojo\nSentence: El perro corre rápido por el parque.",
    category: 'consonant',
    place: 'alveolar',
    manner: 'trill',
    language: 'Spanish',
    guide: {
      tongue_height: 'mid',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'stop',
      description: "Vibrate the tip of your tongue against the roof of your mouth. Requires strong airflow."
    }
  },
  {
    symbol: 'x',
    label: 'j (jota)',
    prompt: "Word: José\nPhrase: Ojo rojo\nSentence: Juan juega con la caja roja.",
    category: 'consonant',
    place: 'velar',
    manner: 'fricative',
    language: 'Spanish',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'back',
      lip_shape: 'neutral',
      airflow: 'fricative',
      description: "Raise the back of your tongue towards the soft palate to create friction like clearing your throat."
    }
  },
  {
    symbol: 'ɲ',
    label: 'ñ (niño)',
    prompt: "Word: Año\nPhrase: Mañana por la mañana\nSentence: El niño sueña con una montaña pequeña.",
    category: 'consonant',
    place: 'palatal',
    manner: 'nasal',
    language: 'Spanish',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'nasal',
      description: "Press the middle of your tongue against the hard palate. Let air flow through your nose."
    }
  },

  // ITALIAN PHONEMES
  {
    symbol: 'ʎ',
    label: 'gl (gli)',
    prompt: "Word: Aglio\nPhrase: La famiglia\nSentence: Voglio una bottiglia di olio.",
    category: 'consonant',
    place: 'palatal',
    manner: 'liquid',
    language: 'Italian',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'liquid',
      description: "Press the body of your tongue against the hard palate. Air flows around the sides."
    }
  },
  {
    symbol: 'ɲ',
    label: 'gn (gnocchi)',
    prompt: "Word: Bagno\nPhrase: Ogni giorno\nSentence: Gli gnocchi sono nel bagno.",
    category: 'consonant',
    place: 'palatal',
    manner: 'nasal',
    language: 'Italian',
    guide: {
      tongue_height: 'high',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'nasal',
      description: "Similar to Spanish ñ. Tongue body against hard palate, nasal airflow."
    }
  },
  {
    symbol: 'ts',
    label: 'z (pizza)',
    prompt: "Word: Pizza\nPhrase: Una tazza\nSentence: La piazza è piena di ragazzi.",
    category: 'consonant',
    place: 'alveolar',
    manner: 'affricate',
    language: 'Italian',
    guide: {
      tongue_height: 'mid',
      tongue_backness: 'front',
      lip_shape: 'neutral',
      airflow: 'stop',
      description: "Start with /t/ tongue position and release into /s/ sound quickly."
    }
  }
];
