// English to Telugu transliteration utility

interface TransliterationMap {
  [key: string]: string;
}

// Mapping for English to Telugu transliteration
const vowelMap: TransliterationMap = {
  'a': 'అ',
  'aa': 'ఆ',
  'A': 'ఆ',
  'i': 'ఇ',
  'ii': 'ఈ',
  'I': 'ఈ',
  'u': 'ఉ',
  'uu': 'ఊ',
  'U': 'ఊ',
  'e': 'ఎ',
  'E': 'ఏ',
  'ai': 'ఐ',
  'o': 'ఒ',
  'O': 'ఓ',
  'au': 'ఔ',
  'ru': 'ఋ',
  'Ru': 'ౠ'
};

const consonantMap: TransliterationMap = {
  'k': 'క',
  'kh': 'ఖ',
  'g': 'గ',
  'gh': 'ఘ',
  'ng': 'ఙ',
  'ch': 'చ',
  'chh': 'ఛ',
  'j': 'జ',
  'jh': 'ఝ',
  'ny': 'ఞ',
  'T': 'ట',
  'Th': 'ఠ',
  'D': 'డ',
  'Dh': 'ఢ',
  'N': 'ణ',
  't': 'త',
  'th': 'థ',
  'd': 'ద',
  'dh': 'ధ',
  'n': 'న',
  'p': 'ప',
  'ph': 'ఫ',
  'b': 'బ',
  'bh': 'భ',
  'm': 'మ',
  'y': 'య',
  'r': 'ర',
  'l': 'ల',
  'v': 'వ',
  'w': 'వ',
  'sh': 'శ',
  'Sh': 'ష',
  's': 'స',
  'h': 'హ',
  'L': 'ళ',
  'z': 'జ',
  'R': 'ఱ'
};

const matraMap: TransliterationMap = {
  'a': '',
  'aa': 'ా',
  'A': 'ా',
  'i': 'ి',
  'ii': 'ీ',
  'I': 'ీ',
  'u': 'ు',
  'uu': 'ూ',
  'U': 'ూ',
  'e': 'ె',
  'E': 'ే',
  'ai': 'ై',
  'o': 'ొ',
  'O': 'ో',
  'au': 'ౌ',
  'ru': 'ృ'
};

export class Transliterator {
  transliterate(input: string): string {
    if (!input) return '';
    
    let result = '';
    let i = 0;
    const text = input.toLowerCase();
    
    while (i < text.length) {
      let matched = false;
      
      // Try to match longer sequences first
      for (let len = 3; len >= 1; len--) {
        const substr = text.substr(i, len);
        
        // Check for consonant + vowel combinations
        if (len > 1) {
          for (const [cons, teluguCons] of Object.entries(consonantMap)) {
            if (substr.startsWith(cons) && substr.length > cons.length) {
              const vowelPart = substr.substring(cons.length);
              if (matraMap.hasOwnProperty(vowelPart)) {
                result += teluguCons + matraMap[vowelPart];
                i += substr.length;
                matched = true;
                break;
              }
            }
          }
          if (matched) break;
        }
        
        // Check for standalone consonants
        if (consonantMap.hasOwnProperty(substr)) {
          // Check if next character is a vowel
          const nextChar = text.substr(i + len, 2);
          const nextSingleChar = text.substr(i + len, 1);
          
          if (matraMap.hasOwnProperty(nextChar)) {
            result += consonantMap[substr] + matraMap[nextChar];
            i += len + nextChar.length;
          } else if (matraMap.hasOwnProperty(nextSingleChar)) {
            result += consonantMap[substr] + matraMap[nextSingleChar];
            i += len + 1;
          } else {
            result += consonantMap[substr] + '్'; // Add halant
            i += len;
          }
          matched = true;
          break;
        }
        
        // Check for standalone vowels
        if (vowelMap.hasOwnProperty(substr)) {
          result += vowelMap[substr];
          i += len;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // If no match found, add the character as is (for spaces, punctuation, etc.)
        result += text[i];
        i++;
      }
    }
    
    return result;
  }
}

export const transliterator = new Transliterator();