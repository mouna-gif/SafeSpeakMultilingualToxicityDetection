/**
 * Preprocessing robuste pour la détection de toxicité multilingue
 * Gère les fautes, emojis, leetspeak, et scripts mélangés (FR/AR/Darija)
 */

export interface PreprocessingResult {
  original: string;
  normalized: string;
  tokens: string[];
  features: {
    hasEmojis: boolean;
    hasLeetspeak: boolean;
    hasMixedScript: boolean;
    language: 'fr' | 'ar' | 'darija' | 'mixed';
  };
}

// Mappings pour normalisation
const LEETSPEAK_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's',
  '7': 't', '8': 'b', '@': 'a', '$': 's', '!': 'i',
};

const EMOJI_PATTERNS = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

const ARABIC_RANGE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

// Darija common patterns
const DARIJA_MARKERS = ['walou', 'bزاف', 'مزيان', 'khouya', 'sahbi', 'wach', 'كيفاش'];

/**
 * Détecte la langue du texte
 */
export function detectLanguage(text: string): 'fr' | 'ar' | 'darija' | 'mixed' {
  const hasArabic = ARABIC_RANGE.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  const hasDarijaMarkers = DARIJA_MARKERS.some(marker => 
    text.toLowerCase().includes(marker.toLowerCase())
  );

  if (hasDarijaMarkers) return 'darija';
  if (hasArabic && hasLatin) return 'mixed';
  if (hasArabic) return 'ar';
  return 'fr';
}

/**
 * Normalise le leetspeak vers du texte standard
 */
export function normalizeLeetspeak(text: string): string {
  let normalized = text;
  for (const [leet, normal] of Object.entries(LEETSPEAK_MAP)) {
    normalized = normalized.replace(new RegExp(leet, 'g'), normal);
  }
  return normalized;
}

/**
 * Normalise les emojis (garde ou remplace par tag)
 */
export function normalizeEmojis(text: string, keepEmojis: boolean = true): string {
  if (keepEmojis) {
    return text;
  }
  return text.replace(EMOJI_PATTERNS, ' [EMOJI] ');
}

/**
 * Normalise les fautes courantes (FR)
 */
export function normalizeMisspellings(text: string): string {
  const corrections: Record<string, string> = {
    // Fautes courantes en français
    'merde': 'merde', 'mrd': 'merde', 'mrde': 'merde',
    'connard': 'connard', 'conard': 'connard', 'konar': 'connard',
    'salope': 'salope', 'slp': 'salope', 'sal0pe': 'salope',
    'pute': 'pute', 'pt': 'pute', 'put': 'pute',
    // Darija/Arabe romanisé
    'zmel': 'zmel', 'zemel': 'zmel', '7mar': 'hmar',
    'kelb': 'kelb', 'kalb': 'kelb', 'ka7ba': 'kahba',
  };

  let normalized = text.toLowerCase();
  for (const [variant, standard] of Object.entries(corrections)) {
    const regex = new RegExp(`\\b${variant}\\b`, 'gi');
    normalized = normalized.replace(regex, standard);
  }
  return normalized;
}

/**
 * Tokenization simple (split sur whitespace + ponctuation)
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Pipeline de prétraitement complet
 */
export function preprocess(text: string, options: {
  normalizeLeet?: boolean;
  normalizeEmoji?: boolean;
  normalizeMisspell?: boolean;
} = {}): PreprocessingResult {
  const {
    normalizeLeet = true,
    normalizeEmoji = false,
    normalizeMisspell = true,
  } = options;

  let processed = text;
  
  // Détection des features
  const hasEmojis = EMOJI_PATTERNS.test(text);
  const hasLeetspeak = /[0-9@$!]/.test(text);
  const language = detectLanguage(text);
  const hasMixedScript = language === 'mixed' || language === 'darija';

  // Normalisation
  if (normalizeLeet) {
    processed = normalizeLeetspeak(processed);
  }
  if (normalizeEmoji) {
    processed = normalizeEmojis(processed, false);
  }
  if (normalizeMisspell) {
    processed = normalizeMisspellings(processed);
  }

  // Tokenization
  const tokens = tokenize(processed);

  return {
    original: text,
    normalized: processed,
    tokens,
    features: {
      hasEmojis,
      hasLeetspeak,
      hasMixedScript,
      language,
    },
  };
}

/**
 * Génère des variantes adversariales (pour training/testing)
 */
export function generateAdversarialVariants(text: string): string[] {
  const variants: string[] = [text];

  // Ajout de leetspeak
  let leetVariant = text;
  leetVariant = leetVariant.replace(/a/gi, '4').replace(/e/gi, '3').replace(/o/gi, '0');
  variants.push(leetVariant);

  // Ajout d'espaces
  const spacedVariant = text.split('').join(' ');
  variants.push(spacedVariant);

  // Répétition de lettres
  const repeatedVariant = text.replace(/([aeiou])/gi, '$1$1');
  variants.push(repeatedVariant);

  // Casse mixte
  const mixedCaseVariant = text
    .split('')
    .map((char, i) => (i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
    .join('');
  variants.push(mixedCaseVariant);

  return variants;
}
