
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { RotateCw, Sparkles } from 'lucide-react';

const MirrorRoom = () => {
  const { isLocked, lockApp, unlockApp, lockUntil, resetLock } = useApp();
  const [isDeciding, setIsDeciding] = useState(false);
  const [customHours, setCustomHours] = useState<number>(12);
  const navigate = useNavigate();

  const handleUnlock = () => {
    setIsDeciding(true);
    setTimeout(() => {
      unlockApp();
      navigate('/tasks');
      setIsDeciding(false);
    }, 1000);
  };

  const handleLock = () => {
    setIsDeciding(true);
    setTimeout(() => {
      lockApp(customHours * 60 * 60 * 1000); // Convert hours to milliseconds
      setIsDeciding(false);
    }, 1000);
  };

  if (isLocked && lockUntil) {
    const timeRemaining = Math.max(0, new Date(lockUntil).getTime() - Date.now());
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-red-500">App Locked</h1>
        
        <div className="glass-panel p-8 max-w-md w-full">
          <p className="text-lg mb-8">
            You chose not to show up as your future self today.
          </p>
          
          <div className="text-3xl font-bold mb-6">
            <span className="warning-text">{hoursRemaining}h {minutesRemaining}m</span>
          </div>
          
          <p className="text-sm text-gray-400 mb-8">
            Time remaining until you can try again.
          </p>

          <Button
            variant="outline"
            onClick={resetLock}
            className="w-full border-red-500/50 hover:bg-red-500/10 group transition-all duration-300"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            I Want to Change Myself
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-4 max-w-xs">
          "The future doesn't wait. Every day you don't choose to become her, she gets further away."
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="glass-panel p-8 w-full max-w-lg flex flex-col items-center gap-10 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 blur-in">
          Who are you showing up as today?
        </h1>
        
        <div className="mb-10 w-32 h-32 rounded-full border border-white/10 flex items-center justify-center opacity-70">
          <div className="text-6xl blur-in animate-pulse-subtle">👤</div>
        </div>
        
        <div className="space-y-5 w-full">
          <Button
            variant="outline"
            className="w-full py-7 text-lg bg-black/50 border-neon hover:bg-neon/10 group transition-all duration-300"
            disabled={isDeciding}
            onClick={handleUnlock}
          >
            <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles size={18} />
            </span>
            <span className="neon-text">I'M HER</span>
          </Button>
          
          <div className="space-y-3">
            <input
              type="number"
              min="1"
              max="72"
              value={customHours}
              onChange={(e) => setCustomHours(Math.max(1, Math.min(72, parseInt(e.target.value) || 12)))}
              className="w-full bg-black/30 border border-white/10 rounded px-4 py-2 text-center mb-2"
              placeholder="Lock duration in hours"
            />
            
            <Button
              variant="ghost" 
              className="w-full py-7 text-lg hover:bg-warning/10"
              disabled={isDeciding}
              onClick={handleLock}
            >
              <span className="warning-text">Not ready ({customHours}h lockout)</span>
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          No edits. No second chance today.
        </p>
      </div>
    </div>
  );
};

export default MirrorRoom;
