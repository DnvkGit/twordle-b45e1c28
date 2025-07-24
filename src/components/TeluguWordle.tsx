import { useState, useEffect } from 'react';
import { GameGrid } from './GameGrid';
import { InputArea } from './InputArea';
import { GameHeader } from './GameHeader';
import { getDailyWord, splitSyllables, determineCellState, CellState } from '@/utils/teluguUtils';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const TeluguWordle = () => {
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameMode, setGameMode] = useState('NORMAL');
  const [gameLevel, setGameLevel] = useState('AMATEUR');
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [hintMessage, setHintMessage] = useState<string>('');
  
  const dailyWord = getDailyWord(selectedDate || undefined);
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

  const getPast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      
      days.push({
        date,
        displayDate: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}(${dayName})`
      });
    }
    
    return days;
  };

  const handleHistorySelect = (date: Date) => {
    setSelectedDate(date);
    setGameMode('HISTORY');
    setCurrentDate(date.toLocaleDateString());
    setGuesses([]);
    setCurrentGuess([]);
    setGameOver(false);
    setWon(false);
    setShowHistory(false);
    setHintMessage('');
    
    toast({
      title: "History Mode",
      description: `Playing puzzle from ${date.toLocaleDateString()}`,
      variant: "default"
    });
  };

  const handleBackToToday = () => {
    setSelectedDate(null);
    setGameMode('NORMAL');
    setCurrentDate(new Date().toLocaleDateString());
    setGuesses([]);
    setCurrentGuess([]);
    setGameOver(false);
    setWon(false);
    setHintMessage('');
    
    toast({
      title: "Back to Today",
      description: "Playing today's puzzle",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader
        gameMode={gameMode}
        currentDate={currentDate}
        gameLevel={gameLevel}
        onShowHelp={() => toast({ title: "Help", description: "Type Telugu words using English letters!" })}
        onShowHistory={() => setShowHistory(true)}
        onShowHint={showHint}
        onToggleLevel={() => setGameLevel(gameLevel === 'AMATEUR' ? 'PRO' : 'AMATEUR')}
      />
      
      <div className="container mx-auto py-2 px-2">
        {/* Input Area at Top */}
        {!gameOver && (
          <div className="mb-2">
            <InputArea
              onSubmit={handleSubmitGuess}
              disabled={gameOver}
              hintMessage={hintMessage}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-2">
          {/* Main Game Area */}
          <div className="flex-1">
            <GameGrid
              guesses={guesses}
              currentGuess={currentGuess}
              answer={answer}
              currentRow={guesses.length}
            />
            
          </div>

          {/* Detailed Legend on Right Side for larger screens */}
          <div className="hidden lg:block w-72">
            <div className="bg-gradient-card rounded-lg p-3 border border-border">
              <h3 className="font-semibold mb-2 text-xs text-center">Color Legend</h3>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-correct rounded-sm flex-shrink-0"></div>
                  <span className="text-muted-foreground">All OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-light rounded-sm flex-shrink-0"></div>
                  <span className="text-muted-foreground">Pos OK - Gunintam Wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple rounded-sm flex-shrink-0"></div>
                  <span className="text-muted-foreground">Pos OK - Samyuktakshara Wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-present rounded-sm flex-shrink-0"></div>
                  <span className="text-muted-foreground">Pos Not OK - Syllable OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-light rounded-sm flex-shrink-0"></div>
                  <span className="text-muted-foreground">Pos Not OK - Gunintam Wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brown-accent rounded-sm flex-shrink-0"></div>
                  <span className="text-muted-foreground">Pos Not OK - Samyuktakshara Wrong</span>
                </div>
              </div>
              
              {/* Game Mode Indicator */}
              {gameMode === 'HISTORY' && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBackToToday}
                    className="w-full text-xs"
                  >
                    Back to Today
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
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
            {gameMode === 'HISTORY' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToToday}
                className="mt-4"
              >
                Back to Today
              </Button>
            )}
          </div>
        )}
      </div>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-telugu">History - Past 7 Days</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {getPast7Days().map((day, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleHistorySelect(day.date)}
              >
                {day.displayDate}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};