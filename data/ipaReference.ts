
export interface IPAReferenceItem {
  symbol: string;
  name: string;
  example: string;
  description: string;
  voice: 'voiced' | 'voiceless';
}

// A subset of the full IPA for the chart display
export const IPA_REFERENCE: Record<string, IPAReferenceItem> = {
  // PLOSIVES
  'p': { symbol: 'p', name: 'Voiceless Bilabial Plosive', example: 'pen, spin', description: 'Lips close completely, blocking air, then release with a burst.', voice: 'voiceless' },
  'b': { symbol: 'b', name: 'Voiced Bilabial Plosive', example: 'but, web', description: 'Like /p/ but with vocal cord vibration.', voice: 'voiced' },
  't': { symbol: 't', name: 'Voiceless Alveolar Plosive', example: 'two, sting', description: 'Tongue tip touches alveolar ridge, blocking air.', voice: 'voiceless' },
  'd': { symbol: 'd', name: 'Voiced Alveolar Plosive', example: 'do, odd', description: 'Like /t/ but voiced.', voice: 'voiced' },
  'k': { symbol: 'k', name: 'Voiceless Velar Plosive', example: 'cat, kill', description: 'Back of tongue touches soft palate.', voice: 'voiceless' },
  'g': { symbol: 'g', name: 'Voiced Velar Plosive', example: 'go, get', description: 'Like /k/ but voiced.', voice: 'voiced' },
  'ʔ': { symbol: 'ʔ', name: 'Glottal Stop', example: 'uh-oh, button', description: 'Airflow stopped abruptly by the vocal cords.', voice: 'voiceless' },
  
  // Retroflex Plosives
  'ʈ': { symbol: 'ʈ', name: 'Voiceless Retroflex Plosive', example: 'Hindi: ṭamāṭar', description: 'Tongue tip curled back touching hard palate.', voice: 'voiceless' },
  'ɖ': { symbol: 'ɖ', name: 'Voiced Retroflex Plosive', example: 'Swedish: nord', description: 'Like /ʈ/ but voiced.', voice: 'voiced' },
  // Palatal Plosives
  'c': { symbol: 'c', name: 'Voiceless Palatal Plosive', example: 'tune (dialects)', description: 'Tongue body touches hard palate.', voice: 'voiceless' },
  'ɟ': { symbol: 'ɟ', name: 'Voiced Palatal Plosive', example: 'dew (dialects)', description: 'Like /c/ but voiced.', voice: 'voiced' },
  // Uvular Plosives
  'q': { symbol: 'q', name: 'Voiceless Uvular Plosive', example: 'Arabic: qalb', description: 'Back of tongue touches uvula.', voice: 'voiceless' },
  'ɢ': { symbol: 'ɢ', name: 'Voiced Uvular Plosive', example: 'Persian: qom', description: 'Like /q/ but voiced.', voice: 'voiced' },

  // NASALS
  'm': { symbol: 'm', name: 'Bilabial Nasal', example: 'man, ham', description: 'Lips closed, air flows through nose.', voice: 'voiced' },
  'ɱ': { symbol: 'ɱ', name: 'Labiodental Nasal', example: 'symphony', description: 'Top teeth touch bottom lip, air flows through nose.', voice: 'voiced' },
  'n': { symbol: 'n', name: 'Alveolar Nasal', example: 'no, tin', description: 'Tongue tip on alveolar ridge, air flows through nose.', voice: 'voiced' },
  'ɳ': { symbol: 'ɳ', name: 'Retroflex Nasal', example: 'Norwegian: garn', description: 'Tongue curled back, air flows through nose.', voice: 'voiced' },
  'ɲ': { symbol: 'ɲ', name: 'Palatal Nasal', example: 'canyon, onion', description: 'Tongue body on hard palate, air flows through nose.', voice: 'voiced' },
  'ŋ': { symbol: 'ŋ', name: 'Velar Nasal', example: 'sing, finger', description: 'Back of tongue on soft palate, air flows through nose.', voice: 'voiced' },
  'ɴ': { symbol: 'ɴ', name: 'Uvular Nasal', example: 'Japanese: nihon', description: 'Back of tongue on uvula, air flows through nose.', voice: 'voiced' },

  // FRICATIVES
  'ɸ': { symbol: 'ɸ', name: 'Voiceless Bilabial Fricative', example: 'Japanese: fujisan', description: 'Air blown between compressed lips.', voice: 'voiceless' },
  'β': { symbol: 'β', name: 'Voiced Bilabial Fricative', example: 'Spanish: haba', description: 'Like /ɸ/ but voiced.', voice: 'voiced' },
  'f': { symbol: 'f', name: 'Voiceless Labiodental Fricative', example: 'fool, enough', description: 'Top teeth touch bottom lip, air blows through.', voice: 'voiceless' },
  'v': { symbol: 'v', name: 'Voiced Labiodental Fricative', example: 'voice, have', description: 'Like /f/ but voiced.', voice: 'voiced' },
  'θ': { symbol: 'θ', name: 'Voiceless Dental Fricative', example: 'thing, teeth', description: 'Tongue tip between teeth, air blows through.', voice: 'voiceless' },
  'ð': { symbol: 'ð', name: 'Voiced Dental Fricative', example: 'this, breathe', description: 'Like /θ/ but voiced.', voice: 'voiced' },
  's': { symbol: 's', name: 'Voiceless Alveolar Fricative', example: 'see, pass', description: 'Tongue close to alveolar ridge, air hisses.', voice: 'voiceless' },
  'z': { symbol: 'z', name: 'Voiced Alveolar Fricative', example: 'zoo, rose', description: 'Like /s/ but voiced.', voice: 'voiced' },
  'ʃ': { symbol: 'ʃ', name: 'Voiceless Postalveolar Fricative', example: 'she, crash', description: 'Tongue further back than /s/, wider channel.', voice: 'voiceless' },
  'ʒ': { symbol: 'ʒ', name: 'Voiced Postalveolar Fricative', example: 'measure, vision', description: 'Like /ʃ/ but voiced.', voice: 'voiced' },
  'ʂ': { symbol: 'ʂ', name: 'Voiceless Retroflex Fricative', example: 'Mandarin: shī', description: 'Tongue curled back, fricative airflow.', voice: 'voiceless' },
  'ʐ': { symbol: 'ʐ', name: 'Voiced Retroflex Fricative', example: 'Polish: żaba', description: 'Like /ʂ/ but voiced.', voice: 'voiced' },
  'ç': { symbol: 'ç', name: 'Voiceless Palatal Fricative', example: 'German: ich', description: 'Tongue body close to hard palate.', voice: 'voiceless' },
  'ʝ': { symbol: 'ʝ', name: 'Voiced Palatal Fricative', example: 'Spanish: yo (dialects)', description: 'Like /ç/ but voiced.', voice: 'voiced' },
  'x': { symbol: 'x', name: 'Voiceless Velar Fricative', example: 'Scottish: loch', description: 'Back of tongue close to soft palate.', voice: 'voiceless' },
  'ɣ': { symbol: 'ɣ', name: 'Voiced Velar Fricative', example: 'Spanish: lago', description: 'Like /x/ but voiced.', voice: 'voiced' },
  'χ': { symbol: 'χ', name: 'Voiceless Uvular Fricative', example: 'French: rouge', description: 'Back of tongue close to uvula.', voice: 'voiceless' },
  'ʁ': { symbol: 'ʁ', name: 'Voiced Uvular Fricative', example: 'French: paris', description: 'Like /χ/ but voiced (or approximant).', voice: 'voiced' },
  'ħ': { symbol: 'ħ', name: 'Voiceless Pharyngeal Fricative', example: 'Arabic: ḥa', description: 'Constriction in the pharynx.', voice: 'voiceless' },
  'ʕ': { symbol: 'ʕ', name: 'Voiced Pharyngeal Fricative', example: 'Arabic: ʿayn', description: 'Like /ħ/ but voiced.', voice: 'voiced' },
  'h': { symbol: 'h', name: 'Voiceless Glottal Fricative', example: 'ham, ahead', description: 'Air passes through open vocal cords.', voice: 'voiceless' },
  'ɦ': { symbol: 'ɦ', name: 'Voiced Glottal Fricative', example: 'Czech: hrad', description: 'Breathy voiced /h/.', voice: 'voiced' },

  // AFFRICATES (Non-pulmonic in standard chart usually, but common in English charts)
  'tʃ': { symbol: 'tʃ', name: 'Voiceless Postalveolar Affricate', example: 'chair, watch', description: 'Combination of /t/ and /ʃ/.', voice: 'voiceless' },
  'dʒ': { symbol: 'dʒ', name: 'Voiced Postalveolar Affricate', example: 'joy, bridge', description: 'Combination of /d/ and /ʒ/.', voice: 'voiced' },

  // APPROXIMANTS
  'ʋ': { symbol: 'ʋ', name: 'Labiodental Approximant', example: 'Dutch: wang', description: 'Lips/teeth approximation without friction.', voice: 'voiced' },
  'ɹ': { symbol: 'ɹ', name: 'Alveolar Approximant', example: 'red, try', description: 'Tongue tip curls up or bunches back.', voice: 'voiced' },
  'ɻ': { symbol: 'ɻ', name: 'Retroflex Approximant', example: 'American: bird', description: 'Tongue tip curled back.', voice: 'voiced' },
  'j': { symbol: 'j', name: 'Palatal Approximant', example: 'yes, yellow', description: 'Tongue body raises to hard palate.', voice: 'voiced' },
  'ɰ': { symbol: 'ɰ', name: 'Velar Approximant', example: 'Spanish: fuego', description: 'Back of tongue to soft palate, unrounded.', voice: 'voiced' },
  'w': { symbol: 'w', name: 'Labial-Velar Approximant', example: 'wet, window', description: 'Lips rounded, back of tongue raised.', voice: 'voiced' },

  // LATERAL APPROXIMANTS
  'l': { symbol: 'l', name: 'Alveolar Lateral Approximant', example: 'light, feel', description: 'Tongue tip touches alveolar ridge, air flows sides.', voice: 'voiced' },
  'ɭ': { symbol: 'ɭ', name: 'Retroflex Lateral Approximant', example: 'Swedish: pärla', description: 'Tongue curled back, lateral airflow.', voice: 'voiced' },
  'ʎ': { symbol: 'ʎ', name: 'Palatal Lateral Approximant', example: 'Italian: glielo', description: 'Tongue body to hard palate, lateral airflow.', voice: 'voiced' },
  'ʟ': { symbol: 'ʟ', name: 'Velar Lateral Approximant', example: 'Mid-Waggon (dialects)', description: 'Back of tongue to soft palate, lateral airflow.', voice: 'voiced' },

  // TRILLS & TAPS
  'r': { symbol: 'r', name: 'Alveolar Trill', example: 'Spanish: perro', description: 'Tongue tip vibrates against alveolar ridge.', voice: 'voiced' },
  'ʀ': { symbol: 'ʀ', name: 'Uvular Trill', example: 'German: rot (varieties)', description: 'Uvula vibrates against back of tongue.', voice: 'voiced' },
  'ɾ': { symbol: 'ɾ', name: 'Alveolar Tap/Flap', example: 'water (US), butter', description: 'Quick touch of tongue to alveolar ridge.', voice: 'voiced' },
  'ɽ': { symbol: 'ɽ', name: 'Retroflex Flap', example: 'Hindi: baṛā', description: 'Quick flap of curled tongue.', voice: 'voiced' },

  // VOWELS
  'i': { symbol: 'i', name: 'Close Front Unrounded', example: 'see', description: 'Tongue high and front.', voice: 'voiced' },
  'y': { symbol: 'y', name: 'Close Front Rounded', example: 'French: tu', description: 'Like /i/ but rounded lips.', voice: 'voiced' },
  'ɨ': { symbol: 'ɨ', name: 'Close Central Unrounded', example: 'Russian: ты', description: 'High central tongue.', voice: 'voiced' },
  'ʉ': { symbol: 'ʉ', name: 'Close Central Rounded', example: 'Swedish: sju', description: 'Like /ɨ/ but rounded.', voice: 'voiced' },
  'ɯ': { symbol: 'ɯ', name: 'Close Back Unrounded', example: 'Turkish: ılık', description: 'High back tongue, unrounded.', voice: 'voiced' },
  'u': { symbol: 'u', name: 'Close Back Rounded', example: 'moon', description: 'High back tongue, rounded.', voice: 'voiced' },
  
  'ɪ': { symbol: 'ɪ', name: 'Near-close Front Unrounded', example: 'sit', description: 'Lower and more relaxed than /i/.', voice: 'voiced' },
  'ʏ': { symbol: 'ʏ', name: 'Near-close Front Rounded', example: 'German: hübsch', description: 'Rounded version of /ɪ/.', voice: 'voiced' },
  'ʊ': { symbol: 'ʊ', name: 'Near-close Near-back Rounded', example: 'put', description: 'Tongue high-ish and back.', voice: 'voiced' },

  'e': { symbol: 'e', name: 'Close-mid Front Unrounded', example: 'may (no glide)', description: 'Mid-high front.', voice: 'voiced' },
  'ø': { symbol: 'ø', name: 'Close-mid Front Rounded', example: 'French: peu', description: 'Rounded /e/.', voice: 'voiced' },
  'ɘ': { symbol: 'ɘ', name: 'Close-mid Central Unrounded', example: 'Australian: bird', description: 'Mid-high central.', voice: 'voiced' },
  'ɵ': { symbol: 'ɵ', name: 'Close-mid Central Rounded', example: 'Swedish: full', description: 'Rounded /ɘ/.', voice: 'voiced' },
  'ɤ': { symbol: 'ɤ', name: 'Close-mid Back Unrounded', example: 'Mandarin: hē', description: 'Unrounded /o/.', voice: 'voiced' },
  'o': { symbol: 'o', name: 'Close-mid Back Rounded', example: 'go (no glide)', description: 'Mid-high back rounded.', voice: 'voiced' },

  'ə': { symbol: 'ə', name: 'Mid Central (Schwa)', example: 'about', description: 'Neutral tongue position.', voice: 'voiced' },

  'ɛ': { symbol: 'ɛ', name: 'Open-mid Front Unrounded', example: 'bed', description: 'Mid-low front.', voice: 'voiced' },
  'œ': { symbol: 'œ', name: 'Open-mid Front Rounded', example: 'French: œuf', description: 'Rounded /ɛ/.', voice: 'voiced' },
  'ɜ': { symbol: 'ɜ', name: 'Open-mid Central Unrounded', example: 'bird (RP)', description: 'Mid-low central.', voice: 'voiced' },
  'ɞ': { symbol: 'ɞ', name: 'Open-mid Central Rounded', example: 'Irish: tomhail', description: 'Rounded /ɜ/.', voice: 'voiced' },
  'ʌ': { symbol: 'ʌ', name: 'Open-mid Back Unrounded', example: 'cup', description: 'Mid-low back unrounded.', voice: 'voiced' },
  'ɔ': { symbol: 'ɔ', name: 'Open-mid Back Rounded', example: 'thought', description: 'Mid-low back rounded.', voice: 'voiced' },

  'æ': { symbol: 'æ', name: 'Near-open Front Unrounded', example: 'cat', description: 'Low front.', voice: 'voiced' },
  'ɐ': { symbol: 'ɐ', name: 'Near-open Central', example: 'German: theater', description: 'Low central.', voice: 'voiced' },

  'a': { symbol: 'a', name: 'Open Front Unrounded', example: 'French: patte', description: 'Very low front.', voice: 'voiced' },
  'ɶ': { symbol: 'ɶ', name: 'Open Front Rounded', example: 'Austrian: seil', description: 'Rounded /a/.', voice: 'voiced' },
  'ɑ': { symbol: 'ɑ', name: 'Open Back Unrounded', example: 'father', description: 'Very low back.', voice: 'voiced' },
  'ɒ': { symbol: 'ɒ', name: 'Open Back Rounded', example: 'hot (RP)', description: 'Very low back rounded.', voice: 'voiced' },
};

// Grid Mapping Helpers for the Chart Component
export const IPA_CONSONANT_MAP: Record<string, string[]> = {
  'bilabial-plosive': ['p', 'b'],
  'alveolar-plosive': ['t', 'd'],
  'retroflex-plosive': ['ʈ', 'ɖ'],
  'palatal-plosive': ['c', 'ɟ'],
  'velar-plosive': ['k', 'g'],
  'uvular-plosive': ['q', 'ɢ'],
  'glottal-plosive': ['ʔ'],
  
  'bilabial-nasal': ['m'],
  'labiodental-nasal': ['ɱ'],
  'alveolar-nasal': ['n'],
  'retroflex-nasal': ['ɳ'],
  'palatal-nasal': ['ɲ'],
  'velar-nasal': ['ŋ'],
  'uvular-nasal': ['ɴ'],

  'bilabial-fricative': ['ɸ', 'β'],
  'labiodental-fricative': ['f', 'v'],
  'dental-fricative': ['θ', 'ð'],
  'alveolar-fricative': ['s', 'z'],
  'postalveolar-fricative': ['ʃ', 'ʒ'],
  'retroflex-fricative': ['ʂ', 'ʐ'],
  'palatal-fricative': ['ç', 'ʝ'],
  'velar-fricative': ['x', 'ɣ'],
  'uvular-fricative': ['χ', 'ʁ'],
  'pharyngeal-fricative': ['ħ', 'ʕ'],
  'glottal-fricative': ['h', 'ɦ'],

  // Standard chart puts Trills separately
  'bilabial-trill': ['ʙ'], // Less common, omitted from main ref for brevity but map exists
  'alveolar-trill': ['r'],
  'uvular-trill': ['ʀ'],

  // Taps/Flaps
  'alveolar-tap': ['ɾ'],
  'retroflex-tap': ['ɽ'],

  // Lateral Fricatives
  'alveolar-lateral-fricative': ['ɬ', 'ɮ'],

  'labiodental-approximant': ['ʋ'],
  'alveolar-approximant': ['ɹ'],
  'retroflex-approximant': ['ɻ'],
  'palatal-approximant': ['j'],
  'velar-approximant': ['ɰ'],
  'labial-velar-approximant': ['w'], 
  
  'alveolar-lateral-approximant': ['l'],
  'retroflex-lateral-approximant': ['ɭ'],
  'palatal-lateral-approximant': ['ʎ'],
  'velar-lateral-approximant': ['ʟ'],
};
