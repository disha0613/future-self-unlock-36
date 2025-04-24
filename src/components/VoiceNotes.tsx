import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, AudioWaveform, Play, VolumeX, ArrowLeft } from 'lucide-react';

const VoiceNotes = () => {
  const { voiceNotes, addVoiceNote } = useApp();
  const navigate = useNavigate();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setCurrentlyPlaying(null);
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setRecordingComplete(true);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingComplete(false);
      setAudioURL(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const saveRecording = () => {
    if (audioURL) {
      addVoiceNote(audioURL);
      setRecordingComplete(false);
      setAudioURL(null);
    }
  };
  
  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      
      audioRef.current.src = url;
      audioRef.current.play();
      setCurrentlyPlaying(url);
    }
  };
  
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    }
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="glass-panel p-8 border border-neon/30">
          <h1 className="text-2xl font-bold mb-6 neon-text">
            Record a message from your future self
          </h1>
          
          {!recordingComplete ? (
            <>
              <div className="mb-8 text-center">
                <div className="w-24 h-24 rounded-full border border-neon flex items-center justify-center mx-auto mb-4">
                  {isRecording ? (
                    <AudioWaveform className="h-12 w-12 text-neon animate-pulse" />
                  ) : (
                    <Mic className="h-12 w-12 text-neon" />
                  )}
                </div>
                
                {isRecording && (
                  <div className="text-xl font-medium text-neon">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {!isRecording ? (
                  <Button 
                    className="w-full bg-black border border-neon text-neon hover:bg-neon/10"
                    onClick={startRecording}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Record Message
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={stopRecording}
                  >
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4">
                <AudioWaveform className="h-16 w-16 text-neon mx-auto mb-2" />
                <p className="text-lg text-neon">Recording Complete</p>
              </div>
              
              <div className="flex items-center justify-center my-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full bg-black border border-white/20"
                  onClick={() => audioURL && playAudio(audioURL)}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-black border border-neon text-neon hover:bg-neon/10"
                  onClick={saveRecording}
                >
                  Save Recording
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-400 hover:text-white"
                  onClick={startRecording}
                >
                  Record Again
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {voiceNotes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              Your Saved Messages
            </h2>
            
            <div className="space-y-4">
              {voiceNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="glass-panel p-4 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black border border-white/20"
                      onClick={() => 
                        currentlyPlaying === note.audioUrl 
                          ? stopAudio() 
                          : playAudio(note.audioUrl)
                      }
                    >
                      {currentlyPlaying === note.audioUrl ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <p className="text-sm text-gray-400">
                        {new Date(note.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {currentlyPlaying === note.audioUrl && (
                    <AudioWaveform className="h-5 w-5 text-neon animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500 text-center mt-8">
          These are the words you will hear when you want to quit. Hear them, believe them.
        </p>
      </div>
    </div>
  );
};

export default VoiceNotes;
