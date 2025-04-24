
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type JournalEntry = {
  id: string;
  content: string;
  date: string;
};

interface AppContextType {
  // App lock state
  isLocked: boolean;
  lockApp: () => void;
  unlockApp: () => void;
  lockUntil: Date | null;
  
  // Tasks state
  tasks: Task[];
  addTask: (text: string) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
  tasksLocked: boolean;
  lockTasks: () => void;
  
  // Journal state
  journalEntries: JournalEntry[];
  addJournalEntry: (content: string) => void;
  
  // Streak state
  currentStreak: number;
  incrementStreak: () => void;
  resetStreak: () => void;
}

const defaultContext: AppContextType = {
  isLocked: false,
  lockApp: () => {},
  unlockApp: () => {},
  lockUntil: null,
  
  tasks: [],
  addTask: () => {},
  removeTask: () => {},
  completeTask: () => {},
  tasksLocked: false,
  lockTasks: () => {},
  
  journalEntries: [],
  addJournalEntry: () => {},
  
  currentStreak: 0,
  incrementStreak: () => {},
  resetStreak: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // App lock state
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLocked, setTasksLocked] = useState<boolean>(false);
  
  // Journal state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Streak state
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  // Check if app should still be locked
  useEffect(() => {
    const storedLockUntil = localStorage.getItem('lockUntil');
    if (storedLockUntil) {
      const lockDate = new Date(storedLockUntil);
      if (lockDate > new Date()) {
        setIsLocked(true);
        setLockUntil(lockDate);
      } else {
        setIsLocked(false);
        localStorage.removeItem('lockUntil');
      }
    }
    
    // Load tasks from localStorage
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    
    // Load tasks locked state
    const storedTasksLocked = localStorage.getItem('tasksLocked');
    if (storedTasksLocked) {
      setTasksLocked(JSON.parse(storedTasksLocked));
    }
    
    // Load journal entries
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      setJournalEntries(JSON.parse(storedEntries));
    }
    
    // Load streak data
    const storedStreak = localStorage.getItem('currentStreak');
    if (storedStreak) {
      setCurrentStreak(parseInt(storedStreak, 10));
    }
  }, []);

  // App locking functions
  const lockApp = () => {
    const lockDuration = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    const unlockTime = new Date(Date.now() + lockDuration);
    setIsLocked(true);
    setLockUntil(unlockTime);
    localStorage.setItem('lockUntil', unlockTime.toISOString());
    
    toast({
      title: "App Locked",
      description: "You've chosen not to show up today. The app will be locked for 12 hours.",
      variant: "destructive"
    });
  };
  
  const unlockApp = () => {
    setIsLocked(false);
    setLockUntil(null);
    localStorage.removeItem('lockUntil');
    incrementStreak();
    
    toast({
      title: "App Unlocked",
      description: "You've chosen to be your future self today. Keep going.",
    });
  };

  // Task functions
  const addTask = (text: string) => {
    if (tasksLocked) {
      toast({
        title: "Tasks Locked",
        description: "Your tasks are locked for today. No more changes allowed.",
        variant: "destructive"
      });
      return;
    }
    
    if (tasks.length >= 3) {
      toast({
        title: "Maximum Tasks Reached",
        description: "You can only set 3 non-negotiables per day.",
        variant: "destructive"
      });
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };
  
  const removeTask = (id: string) => {
    if (tasksLocked) {
      toast({
        title: "Tasks Locked",
        description: "Your tasks are locked for today. No more changes allowed.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };
  
  const completeTask = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Check if all tasks are complete
    const allComplete = updatedTasks.every(task => task.completed);
    if (allComplete) {
      toast({
        title: "All Tasks Complete",
        description: "You've completed all your non-negotiables today. Future you is proud.",
      });
    }
  };
  
  const lockTasks = () => {
    setTasksLocked(true);
    localStorage.setItem('tasksLocked', 'true');
    
    toast({
      title: "Tasks Locked In",
      description: "Your non-negotiables are now locked in. No more changes for today.",
    });
  };

  // Journal functions
  const addJournalEntry = (content: string) => {
    const newEntry = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
    };
    
    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    toast({
      title: "Journal Entry Saved",
      description: "You've faced your shadows today. Keep moving forward.",
    });
  };

  // Streak functions
  const incrementStreak = () => {
    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    localStorage.setItem('currentStreak', newStreak.toString());
  };
  
  const resetStreak = () => {
    setCurrentStreak(0);
    localStorage.setItem('currentStreak', '0');
    
    toast({
      title: "Streak Reset",
      description: "Your streak has been reset. Time to rebuild.",
      variant: "destructive"
    });
  };

  const contextValue: AppContextType = {
    isLocked,
    lockApp,
    unlockApp,
    lockUntil,
    
    tasks,
    addTask,
    removeTask,
    completeTask,
    tasksLocked,
    lockTasks,
    
    journalEntries,
    addJournalEntry,
    
    currentStreak,
    incrementStreak,
    resetStreak,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
