
import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, BookText, ArrowLeft, AudioWaveform } from 'lucide-react';

const Dashboard = () => {
  const { tasks, currentStreak, voiceNotes } = useApp();
  const navigate = useNavigate();
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mirror Room
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-8">
          Today's Progress
        </h1>

        {/* Streak Card */}
        <div className="glass-panel p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Current Streak</p>
            <p className="text-3xl font-bold neon-text">{currentStreak} days</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-neon/10 border border-neon flex items-center justify-center">
            <Clock className="h-6 w-6 text-neon" />
          </div>
        </div>

        {/* Task Progress Card */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">Non-Negotiables</p>
            <p className="text-sm font-medium">
              <span className="text-neon">{completedTasks}</span>
              <span className="text-gray-400">/{totalTasks}</span>
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-dark-accent rounded-full mb-4">
            <div 
              className="h-full bg-neon rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <Button
            className="w-full border border-white/20 bg-dark hover:bg-dark-accent"
            onClick={() => navigate('/tasks')}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            View Tasks
          </Button>
        </div>

        {/* Journal Card */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">Shadow Journal</p>
            <div className="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center">
              <BookText className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">
            You've acknowledged your shadows today.
          </p>
          
          <Button
            className="w-full border border-white/20 bg-dark hover:bg-dark-accent"
            onClick={() => navigate('/journal')}
          >
            Review Journal
          </Button>
        </div>
        
        {/* Voice Notes Card */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">Future Me Voice Notes</p>
            <div className="w-8 h-8 rounded-full bg-dark-accent flex items-center justify-center">
              <AudioWaveform className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">
            {voiceNotes.length > 0 ? `You have ${voiceNotes.length} saved messages` : 'Record a message from your future self'}
          </p>
          
          <Button
            className="w-full border border-white/20 bg-dark hover:bg-dark-accent"
            onClick={() => navigate('/voice')}
          >
            {voiceNotes.length > 0 ? 'Listen to Messages' : 'Record Message'}
          </Button>
        </div>

        {/* Motivational Quote */}
        <div className="mt-10 text-center">
          <blockquote className="text-lg font-medium italic text-gray-300">
            "The future you won't wait forever. She's already here, waiting for you to become her."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
