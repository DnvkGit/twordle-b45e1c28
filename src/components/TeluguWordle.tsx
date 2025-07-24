import { useState, useEffect } from 'react';
import { GameGrid } from './GameGrid';
import { InputArea } from './InputArea';
import { GameHeader } from './GameHeader';
import { getDailyWord, splitSyllables } from '@/utils/teluguUtils';
import { toast } from '@/hooks/use-toast';

export const TeluguWordle = () => {
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameMode, setGameMode] = useState('NORMAL');
  const [gameLevel, setGameLevel] = useState('AMATEUR');
  const [currentDate] = useState(new Date().toLocaleDateString());
  
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

  const showHint = () => {
    if (gameLevel === 'PRO' || guesses.length > 0) {
      toast({
        title: "Word Meaning",
        description: dailyWord.meaning,
        variant: "default"
      });
    } else {
      toast({
        title: "Hint not available",
        description: "You need to make at least one guess first!",
        variant: "destructive"
      });
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