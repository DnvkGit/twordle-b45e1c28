import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { transliterator } from '@/utils/transliterator';
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
    // For now, we'll split by characters for simplicity
    // In a full implementation, you'd use the syllable splitting logic
    const syllables = Array.from(telugu).slice(0, 4);
    
    // Pad with empty strings if less than 4 syllables
    while (syllables.length < 4) {
      syllables.push('');
    }
    
    onSubmit(syllables);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="bg-gradient-card rounded-xl p-6 border border-border shadow-elegant">
        <div className="space-y-4">
          <div>
            <label htmlFor="word-input" className="block text-sm font-medium text-muted-foreground mb-2">
              Enter word in English
            </label>
            <Input
              id="word-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type in English..."
              disabled={disabled}
              className="bg-background/50 border-border focus:border-primary"
            />
          </div>
          
          {teluguPreview && (
            <div className="bg-background/30 rounded-lg p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Telugu Preview:</p>
              <p className="font-telugu text-xl text-foreground">{teluguPreview}</p>
            </div>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="w-full bg-gradient-button hover:shadow-glow transition-all duration-300"
          >
            Submit Guess
          </Button>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Type Telugu words using English letters</p>
        <p className="text-xs mt-1">Example: "padam" → "పదం"</p>
      </div>
    </div>
  );
};