import { useState, useEffect } from 'react';
import { GameGrid } from './GameGrid';
import { InputArea } from './InputArea';
import { GameHeader } from './GameHeader';
import { getDailyWord, splitSyllables, determineCellState, CellState } from '@/utils/teluguUtils';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TeluguWordle = () => {
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameMode, setGameMode] = useState('NORMAL');
  const [gameLevel, setGameLevel] = useState('AMATEUR');
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [hintMessage, setHintMessage] = useState<string>('');
  
  const dailyWord = getDailyWord();
  const answer = splitSyllables(dailyWord.word.replace(/\s/g, ''));

  const handleSubmitGuess = (syllables: string[]) => {
    if (gameOver || syllables.length !== 4) return;

    const validSyllables = syllables.filter(s => s.trim());
    if (validSyllables.length !== 4) {
      toast({
        title: "Invalid guess",
        description: "Please enter exactly 4 syllables",
        variant: "destructive"
      });
      return;
    }

    const newGuesses = [...guesses, syllables];
    setGuesses(newGuesses);
    
    // Check win condition
    if (syllables.join('') === answer.join('')) {
      setWon(true);
      setGameOver(true);
      toast({
        title: "Congratulations! 🎉",
        description: `You solved it in ${newGuesses.length} attempts!`,
        variant: "default"
      });
    } else if (newGuesses.length >= 10) {
      setGameOver(true);
      toast({
        title: "Game Over",
        description: `The word was: ${dailyWord.word} = ${dailyWord.meaning}`,
        variant: "destructive"
      });
    }
  };

  const hasCorrectCells = (): boolean => {
    return guesses.some(guess => 
      guess.some((letter, index) => 
        determineCellState(guess, answer, index) === 'correct'
      )
    );
  };

  const hasYellowCells = (): boolean => {
    return guesses.some(guess => 
      guess.some((letter, index) => {
        const state = determineCellState(guess, answer, index);
        return state === 'present' || state === 'pink-light' || state === 'purple' || 
               state === 'blue-light' || state === 'brown-accent';
      })
    );
  };

  const showHint = () => {
    if (guesses.length === 0) {
      setHintMessage("You need to make at least one guess first!");
      setTimeout(() => setHintMessage(''), 3000);
      return;
    }

    if (gameLevel === 'PRO') {
      if (hasCorrectCells()) {
        setHintMessage(`Word Meaning: ${dailyWord.meaning}`);
        setTimeout(() => setHintMessage(''), 5000);
      } else {
        setHintMessage("Hint available only after getting at least one syllable correct (green)!");
        setTimeout(() => setHintMessage(''), 3000);
      }
    } else { // AMATEUR level
      if (hasYellowCells()) {
        setHintMessage(`Word Meaning: ${dailyWord.meaning}`);
        setTimeout(() => setHintMessage(''), 5000);
      } else {
        setHintMessage("Hint available after getting at least one syllable match (yellow/colored)!");
        setTimeout(() => setHintMessage(''), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader
        gameMode={gameMode}
        currentDate={currentDate}
        gameLevel={gameLevel}
        onShowHelp={() => toast({ title: "Help", description: "Type Telugu words using English letters!" })}
        onShowHistory={() => toast({ title: "History", description: "Feature coming soon!" })}
        onShowHint={showHint}
        onToggleLevel={() => setGameLevel(gameLevel === 'AMATEUR' ? 'PRO' : 'AMATEUR')}
      />
      
      <div className="container mx-auto py-8">
        <GameGrid
          guesses={guesses}
          currentGuess={currentGuess}
          answer={answer}
          currentRow={guesses.length}
        />
        
        {/* Message Area */}
        {hintMessage && (
          <div className="max-w-sm mx-auto mt-4">
            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription className="text-center font-telugu">
                {hintMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {!gameOver && (
          <InputArea
            onSubmit={handleSubmitGuess}
            disabled={gameOver}
          />
        )}
        
        {gameOver && (
          <div className="text-center mt-8 p-6 bg-gradient-card rounded-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2 font-telugu">
              {won ? '🎉 అభినందనలు!' : '😔 మరొకసారి ప్రయత్నించండి'}
            </h2>
            <p className="text-lg font-telugu mb-2">
              {dailyWord.word} = {dailyWord.meaning}
            </p>
            <p className="text-sm text-muted-foreground">
              {won ? `Solved in ${guesses.length} attempts!` : 'Better luck next time!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};