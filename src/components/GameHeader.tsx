import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, HelpCircle, Settings, Trophy } from 'lucide-react';

interface GameHeaderProps {
  gameMode: string;
  currentDate: string;
  gameLevel: string;
  onShowHelp: () => void;
  onShowHistory: () => void;
  onShowHint: () => void;
  onToggleLevel: () => void;
}

export const GameHeader = ({
  gameMode,
  currentDate,
  gameLevel,
  onShowHelp,
  onShowHistory,
  onShowHint,
  onToggleLevel
}: GameHeaderProps) => {
  return (
    <div className="w-full bg-gradient-card border-b border-border shadow-lg">
      <div className="max-w-4xl mx-auto p-4">
        {/* Top Row - Title and Date */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent font-telugu">
              పదవినోదము
            </h1>
            <p className="text-sm text-muted-foreground font-inter">Telugu Wordle</p>
          </div>
          
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              {currentDate}
            </Badge>
            <div className="flex gap-2">
              <Badge variant={gameMode === 'NORMAL' ? 'default' : 'secondary'}>
                {gameMode}
              </Badge>
              <Badge variant={gameLevel === 'PRO' ? 'destructive' : 'secondary'}>
                {gameLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-correct rounded-sm"></div>
            <span className="text-muted-foreground">All OK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-light rounded-sm"></div>
            <span className="text-muted-foreground">Pos OK - Gunintam Wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple rounded-sm"></div>
            <span className="text-muted-foreground">Pos OK - Samyuktakshara Wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-present rounded-sm"></div>
            <span className="text-muted-foreground">Pos Not OK - Syllable OK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-light rounded-sm"></div>
            <span className="text-muted-foreground">Pos Not OK - Gunintam Wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-brown-accent rounded-sm"></div>
            <span className="text-muted-foreground">Pos Not OK - Samyuktakshara Wrong</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={onShowHelp}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <Button variant="outline" size="sm" onClick={onShowHistory}>
            <Calendar className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={onShowHint}>
            <Trophy className="w-4 h-4 mr-2" />
            Hint
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleLevel}>
            <Settings className="w-4 h-4 mr-2" />
            Level: {gameLevel}
          </Button>
        </div>
      </div>
    </div>
  );
};