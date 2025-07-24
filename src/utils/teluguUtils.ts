// Telugu text processing utilities

export interface TeluguWord {
  word: string;
  meaning: string;
}

// Check character types
export const isAcchu = (unic: number): boolean => {
  return (3077 <= unic && unic <= 3092) || unic === 3168;
};

export const isHallu = (unic: number): boolean => {
  return (3093 <= unic && unic <= 3129) || (3160 <= unic && unic <= 3161);
};

export const isSpl = (unic: number): boolean => {
  return 3072 <= unic && unic <= 3076;
};

export const isMatra = (unic: number): boolean => {
  return (3133 <= unic && unic <= 3148) || unic === 3074;
};

export const isSpace = (unic: number): boolean => {
  return unic === 32;
};

// Split Telugu text into syllables
export const splitSyllables = (tword: string): string[] => {
  const arrU = Array.from(tword).map(ch => ch.codePointAt(0)!);
  const arrE: string[] = [];
  let i = 0;
  const size1 = arrU.length;

  while (i < size1) {
    const tc = arrU[i];
    const nxtch = i + 1 < size1 ? arrU[i + 1] : null;
    const nxtnxtch = i + 2 < size1 ? arrU[i + 2] : null;

    arrE.push(String.fromCodePoint(tc));

    if (isAcchu(tc) && (nxtch === null || !isSpl(nxtch))) {
      arrE.push(',');
    } else if (isAcchu(tc) && nxtch !== null && isSpl(nxtch)) {
      arrE.push(String.fromCodePoint(nxtch));
      arrE.push(',');
      i += 1;
    } else if (isHallu(tc) && nxtch !== null && (isHallu(nxtch) || isAcchu(nxtch))) {
      arrE.push(',');
    } else if (isHallu(tc) && nxtch !== null && (isMatra(nxtch) || isSpl(nxtch))) {
      arrE.push(String.fromCodePoint(nxtch));
      if (nxtnxtch !== null && isSpl(nxtnxtch)) {
        arrE.push(String.fromCodePoint(nxtnxtch));
        i += 1;
      }
      arrE.push(',');
      i += 1;
    } else if (isSpace(tc)) {
      if (arrE.length >= 2 && arrE[arrE.length - 2] !== ',') {
        arrE.push(',');
      }
      arrE.push('*');
      arrE.push(',');
    }

    i += 1;
  }

  arrE.push(',');
  const syllables = arrE.join('').split(',');
  return syllables.filter(syl => syl.trim() && syl !== '*');
};

// Word list from the Python code
export const wordList: TeluguWord[] = [
  { word: 'కృపాణము', meaning: 'కరవాలము' },
  { word: 'అనుమానం', meaning: 'సందేహం' },
  { word: 'మరాళము', meaning: 'హంస' },
  { word: 'అవధూత', meaning: 'సన్యాసి' },
  { word: 'ఎండతాకు', meaning: 'వడదెబ్బ' },
  { word: 'తాళగింపు', meaning: 'తాళమువేయు' },
  { word: 'తిరకాసు', meaning: 'జటిలసమస్య' },
  { word: 'ఒరిపిడి', meaning: 'రాపిడి' },
  { word: 'కరటక', meaning: 'ఎండ్రకాయ' },
  { word: 'సరభస', meaning: 'కోపం కలవాడు' },
  { word: 'ఆలాపన', meaning: 'రాగాలాపము' },
  { word: 'నిశాగణ', meaning: 'రాత్రి సమూహము' },
  { word: 'కొండకోతి', meaning: 'కొండముచ్చు' },
  { word: 'బద్ధముష్టి', meaning: 'పిసినిగొట్టు' },
  { word: 'దృష్టితీరు', meaning: 'వైఖరి' },
  { word: 'రామాయణం', meaning: 'రాముని చరితం' },
  { word: 'డాబుసరి', meaning: 'దర్పము' },
  { word: 'కనుబొమ', meaning: 'భ్రుకుటి' },
  { word: 'సహకారం', meaning: 'సమిష్టి' },
  { word: 'నడిరేయి', meaning: 'అర్ధరాత్రి' },
  { word: 'బంధువులు', meaning: 'చుట్టాలు' },
  { word: 'అక్కటిక', meaning: 'కనికరం' },
  { word: 'ఇందీవరం', meaning: 'నల్లగలువ' },
  { word: 'అడ్డకట్టు', meaning: 'నిరోధించు' },
  { word: 'దివెగుడి', meaning: 'దీపపు గూడు' },
  { word: 'ఘృతశాక', meaning: 'నెయ్యితో కలిపిన కూర' },
  { word: 'కుశలత', meaning: 'నేర్పు' },
  { word: 'కవుగిలి', meaning: 'ఆలింగనము' },
  { word: 'అభిశస్తి', meaning: 'అపవాదము' },
  { word: 'వర్ణనలు', meaning: 'వర్ణనలు' },
  { word: 'ప్రవర్తన', meaning: 'నడత' },
  { word: 'కల్మషాలు', meaning: 'చెడులు' },
  { word: 'మీనకేతు', meaning: 'మన్మథుఁడు' },
  { word: 'పొలిమేర', meaning: 'సరిహద్దు' },
  { word: 'కడియాలు', meaning: 'కంకణములు' },
  { word: 'కబళము', meaning: 'ముద్ద' },
  { word: 'వడియాలు', meaning: 'వేయించిన తిను బండారం' },
  { word: 'నిషిద్దము', meaning: 'ప్రతిబంధము' },
  { word: 'కుందనము', meaning: 'మేలిమి బంగారము' },
  { word: 'బ్రహ్మాండము', meaning: 'విశ్వము' },
  { word: 'మేలురాక', meaning: 'స్వాగతము' },
  { word: 'అనుక్షణం', meaning: 'ప్రతిక్షణము' },
  { word: 'మరకత', meaning: 'పచ్చఱాయి' },
  { word: 'సౌరభము', meaning: 'పరిమళము' },
  { word: 'కరవాలం', meaning: 'కత్తి' },
  { word: 'సమావేశం', meaning: 'కూటమి' },
  { word: 'పతకము', meaning: 'నగ' },
  { word: 'కనుకట్టు', meaning: 'ఇంద్రజాలము' },
  { word: 'వడుకము', meaning: 'వడియము' },
  { word: 'ఉత్సుకత', meaning: 'తహతహ' },
];

// Get daily word based on date
export const getDailyWord = (date?: Date): TeluguWord => {
  const targetDate = date || new Date();
  const startDate = new Date('2024-01-01');
  const daysDiff = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const index = daysDiff % wordList.length;
  return wordList[Math.max(0, index)];
};

// Game state types
export type CellState = 'correct' | 'present' | 'absent' | 'pink-light' | 'brown-accent' | 'blue-light' | 'purple' | 'empty';

export const determineCellState = (guess: string[], answer: string[], position: number): CellState => {
  const letter = guess[position];
  const answerLetter = answer[position];
  
  // Exact match (Green)
  if (letter === answerLetter) {
    return 'correct';
  }
  
  // Same basic consonant but different syllable structure
  if (letter.codePointAt(0) === answerLetter.codePointAt(0)) {
    const letterLen = letter.length;
    const answerLen = answerLetter.length;
    
    if (Math.abs(letterLen - answerLen) <= 1 && letter !== answerLetter) {
      return answerLen < 3 ? 'pink-light' : 'purple';
    } else {
      return 'purple';
    }
  }
  
  // Letter exists in answer but wrong position (Yellow)
  if (answer.includes(letter)) {
    const targetCount = answer.filter(l => l === letter).length;
    const correctCount = guess.slice(0, answer.length).filter((l, i) => l === answer[i] && l === letter).length;
    const occurrenceCount = guess.slice(0, position + 1).filter(l => l === letter).length;
    
    if (targetCount - correctCount - occurrenceCount + 1 >= 0) {
      return 'present';
    }
  }
  
  // Check for matching basic consonant in different positions
  const letterCode = letter.codePointAt(0);
  const answerCodes = answer.map(syl => syl.codePointAt(0));
  
  if (letterCode && answerCodes.includes(letterCode)) {
    const targetCount = answerCodes.filter(code => code === letterCode).length;
    const correctCount = guess.slice(0, answer.length)
      .filter((l, i) => l.codePointAt(0) === answerCodes[i] && l.codePointAt(0) === letterCode).length;
    const occurrenceCount = guess.slice(0, position + 1)
      .filter(l => l.codePointAt(0) === letterCode).length;
    
    if (targetCount > 0 && targetCount - correctCount - occurrenceCount + 1 >= 0) {
      if (!answer.includes(letter) && answerCodes.includes(letterCode)) {
        const index = answerCodes.indexOf(letterCode);
        const toMatch = answer[index];
        return toMatch.length - letter.length > 1 ? 'brown-accent' : 'blue-light';
      }
    }
  }
  
  return 'absent';
};