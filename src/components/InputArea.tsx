import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { transliterator } from '@/utils/transliterator';
import { splitSyllables } from '@/utils/teluguUtils';
import { useState, useEffect } from 'react';

interface InputAreaProps {
  onSubmit: (syllables: string[]) => void;
  disabled: boolean;
}

export const InputArea = ({ onSubmit, disabled }: InputAreaProps) => {
  const [input, setInput] = useState('');
  const [teluguPreview, setTeluguPreview] = useState('');

  useEffect(() => {
    if (input) {
      const telugu = transliterator.transliterate(input);
      setTeluguPreview(telugu);
    } else {
      setTeluguPreview('');
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    
    const telugu = transliterator.transliterate(input);
    // Use proper syllable splitting for Telugu text
    const syllables = splitSyllables(telugu);
    
    // Take first 4 syllables or pad with empty strings
    const finalSyllables = syllables.slice(0, 4);
    while (finalSyllables.length < 4) {
      finalSyllables.push('');
    }
    
    onSubmit(finalSyllables);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 space-y-2">
      <div className="bg-gradient-card rounded-lg p-3 border border-border">
        <div className="space-y-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter in English for ex: vinOdamu → వినోదము"
            disabled={disabled}
            className="bg-background/50 border-border focus:border-primary text-sm"
          />
          
          {teluguPreview && (
            <div className="bg-background/30 rounded p-2 border border-border">
              <p className="font-telugu text-lg text-foreground">{teluguPreview}</p>
            </div>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="w-full bg-gradient-button hover:shadow-glow transition-all duration-300 text-sm py-1"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};