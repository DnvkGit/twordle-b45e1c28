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
  'kSha': 'క్ష',
  'x': 'క్ష',
  'kh': 'ఖ',
  'ch': 'చ',
  'chh': 'ఛ',
  'jh': 'ఝ',
  'Th': 'ఠ',
  'Dh': 'ఢ',
  'th': 'థ',
  'dh': 'ధ',
  'ph': 'ఫ',
  'bh': 'భ',
  'gh': 'ఘ',
  'ng': 'ఙ',
  'ny': 'ఞ',
  'sha': 'ష',
  'Sha': 'ష',
  'Sh': 'ష',
  'sh': 'శ',
  'S': 'శ',
  'k': 'క',
  'g': 'గ',
  'j': 'జ',
  'T': 'ట',
  'D': 'డ',
  'N': 'ణ',
  't': 'త',
  'd': 'ద',
  'n': 'న',
  'p': 'ప',
  'b': 'బ',
  'm': 'మ',
  'y': 'య',
  'r': 'ర',
  'l': 'ల',
  'v': 'వ',
  'w': 'వ',
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
  private nJoinConsonants = ['k', 'g', 'ch', 'j', 't', 'd', 'p', 'b', 'm', 'y', 'r', 'l', 'sh', 's', 'h', 'T', 'D'];
  
  transliterate(input: string): string {
    if (!input) return '';
    
    let result = '';
    let i = 0;
    const text = input.toLowerCase();
    
    while (i < text.length) {
      let matched = false;
      
      // Try to match longer sequences first (up to 4 for kSha)
      for (let len = 4; len >= 1; len--) {
        const substr = text.substr(i, len);
        
        // Special handling for 'n' joins
        if (substr === 'n' && i + 1 < text.length) {
          const nextChar = this.getNextConsonant(text, i + 1);
          if (nextChar && this.nJoinConsonants.some(cons => nextChar.startsWith(cons))) {
            // Use anusvara (ం) for n-joins before certain consonants
            result += 'ం';
            i += 1;
            matched = true;
            break;
          }
        }
        
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
  
  private getNextConsonant(text: string, startIndex: number): string | null {
    // Find the next consonant starting from startIndex
    for (let len = 4; len >= 1; len--) {
      const substr = text.substr(startIndex, len);
      if (consonantMap.hasOwnProperty(substr)) {
        return substr;
      }
    }
    return null;
  }
}

export const transliterator = new Transliterator();