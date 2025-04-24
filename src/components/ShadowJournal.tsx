
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Timer, Check, ArrowRight } from 'lucide-react';

const ShadowJournal = () => {
  const { addJournalEntry } = useApp();
  const [journalContent, setJournalContent] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(180); // 3 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;

    if (secondsLeft <= 0) {
      setTimerActive(false);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, timerActive]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = () => {
    if (journalContent.trim()) {
      addJournalEntry(journalContent);
      setIsDone(true);
    }
  };

  const handleNext = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <div className="glass-panel p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Shadow Journal</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Timer className="h-4 w-4" />
            <span className={`${secondsLeft < 30 ? 'text-warning' : 'text-gray-400'}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
        </div>

        {!isDone ? (
          <>
            <p className="mb-6 text-gray-300">
              How are you sabotaging yourself today?
            </p>
            
            <Textarea
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
              placeholder="Write freely about your doubts, fears, and self-sabotaging thoughts..."
              className="min-h-[200px] bg-dark-accent border-white/10 focus:border-neon mb-6"
            />
            
            <Button 
              onClick={handleSubmit}
              className="w-full bg-black border border-white/20 hover:border-neon hover:text-neon"
              disabled={!journalContent.trim()}
            >
              <Check className="mr-2 h-4 w-4" />
              Done
            </Button>
          </>
        ) : (
          <div className="text-center space-y-6">
            <div className="py-8">
              <div className="w-16 h-16 rounded-full bg-neon/10 border border-neon flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-neon" />
              </div>
              <p className="text-xl font-medium text-neon">Journal Entry Saved</p>
            </div>
            
            <p className="text-gray-300">
              You've faced your shadows today. This is where growth begins.
            </p>
            
            <Button 
              onClick={handleNext}
              className="w-full bg-black border border-neon text-neon hover:bg-neon/10"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        
        {!isDone && (
          <p className="text-sm text-gray-500 text-center mt-6">
            No skipping this. Face your mind first.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShadowJournal;
