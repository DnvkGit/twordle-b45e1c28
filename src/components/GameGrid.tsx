import { CellState } from '@/utils/teluguUtils';

interface GameGridProps {
  guesses: string[][];
  currentGuess: string[];
  answer: string[];
  currentRow: number;
}

const getCellColor = (state: CellState): string => {
  switch (state) {
    case 'correct':
      return 'bg-correct text-white border-correct';
    case 'present':
      return 'bg-present text-white border-present';
    case 'pink-light':
      return 'bg-pink-light text-white border-pink-light';
    case 'purple':
      return 'bg-purple text-white border-purple';
    case 'blue-light':
      return 'bg-blue-light text-white border-blue-light';
    case 'brown-accent':
      return 'bg-brown-accent text-white border-brown-accent';
    case 'absent':
      return 'bg-absent text-muted-foreground border-absent';
    default:
      return 'bg-card border-border text-foreground hover:border-primary/50';
  }
};

export const GameGrid = ({ guesses, currentGuess, answer, currentRow }: GameGridProps) => {
  const ROWS = 10;
  const COLS = 4;

  const getCellState = (rowIndex: number, colIndex: number): CellState => {
    if (rowIndex >= guesses.length) return 'empty';
    
    const guess = guesses[rowIndex];
    if (!guess || colIndex >= guess.length) return 'empty';
    
    const letter = guess[colIndex];
    const answerLetter = answer[colIndex];
    
    // Exact match
    if (letter === answerLetter) {
      return 'correct';
    }
    
    // Same basic consonant but different structure
    if (letter.codePointAt(0) === answerLetter.codePointAt(0)) {
      const letterLen = letter.length;
      const answerLen = answerLetter.length;
      
      if (Math.abs(letterLen - answerLen) <= 1 && letter !== answerLetter) {
        return answerLen < 3 ? 'pink-light' : 'purple';
      }
      return 'purple';
    }
    
    // Letter exists elsewhere
    if (answer.includes(letter)) {
      return 'present';
    }
    
    // Check for matching basic consonant in different positions
    const letterCode = letter.codePointAt(0);
    const answerCodes = answer.map(syl => syl.codePointAt(0));
    
    if (letterCode && answerCodes.includes(letterCode) && !answer.includes(letter)) {
      const index = answerCodes.indexOf(letterCode);
      const toMatch = answer[index];
      return toMatch.length - letter.length > 1 ? 'brown-accent' : 'blue-light';
    }
    
    return 'absent';
  };

  return (
    <div className="grid grid-rows-10 gap-2 p-4 max-w-sm mx-auto">
      {Array.from({ length: ROWS }, (_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-2">
          {Array.from({ length: COLS }, (_, colIndex) => {
            const isCurrentRow = rowIndex === currentRow;
            const hasGuess = rowIndex < guesses.length;
            const cellState = hasGuess ? getCellState(rowIndex, colIndex) : 'empty';
            
            // Show current guess being typed
            const displayText = hasGuess 
              ? guesses[rowIndex]?.[colIndex] || ''
              : (isCurrentRow ? currentGuess[colIndex] || '' : '');

            return (
              <div
                key={colIndex}
                className={`
                  aspect-square border-2 rounded-lg flex items-center justify-center
                  font-telugu font-semibold text-lg transition-all duration-300
                  ${getCellColor(cellState)}
                  ${isCurrentRow && !hasGuess ? 'ring-2 ring-primary/30' : ''}
                `}
              >
                <span className="text-center leading-none">
                  {displayText}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};