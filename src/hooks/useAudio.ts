import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudio = (audioSrc?: string) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const audio = new Audio();
    
    if (audioSrc) {
      // Load actual MP3
      audio.src = audioSrc;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoaded(true);
      });
      
      audio.addEventListener('canplaythrough', () => {
        setIsLoaded(true);
      });
      
      audio.addEventListener('error', () => {
        console.error('Error loading audio:', audioSrc);
        setDuration(60);
        setIsLoaded(false);
      });
    } else {
      // Create silent audio using a simple approach
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const sampleRate = 44100;
        const durationInSeconds = 60;
        const numSamples = Math.floor(sampleRate * durationInSeconds);
        const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
          data[i] = 0;
        }
        
        const wavBlob = createWavFromBuffer(buffer, sampleRate);
        const url = URL.createObjectURL(wavBlob);
        audio.src = url;
        
        audio.addEventListener('loadedmetadata', () => {
          if (audio.duration > 0) {
            setDuration(audio.duration);
          } else {
            setDuration(durationInSeconds);
          }
          setIsLoaded(true);
        });
        
        audio.addEventListener('error', () => {
          setDuration(durationInSeconds);
          setIsLoaded(true);
        });
        
        setTimeout(() => {
          if (audio.duration && audio.duration > 0) {
            setDuration(audio.duration);
          } else {
            setDuration(durationInSeconds);
          }
          setIsLoaded(true);
        }, 1000);
        
      } catch (error) {
        console.error('Error creating silent audio:', error);
        setDuration(60);
        setIsLoaded(true);
      }
    }
    
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioSrc]);

  // Helper function to create WAV from AudioBuffer
  const createWavFromBuffer = (buffer: AudioBuffer, sampleRate: number): Blob => {
    const numChannels = buffer.numberOfChannels;
    const length = buffer.length;
    const dataLength = length * numChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(arrayBuffer);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const updateTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateTime);
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && isLoaded) {
      audioRef.current?.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      animationRef.current = requestAnimationFrame(updateTime);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateTime, isLoaded]);

  const togglePlay = useCallback(() => {
    if (!isLoaded) {
      console.warn('Audio not loaded yet');
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [isLoaded]);

  const seek = useCallback((time: number) => {
    if (audioRef.current && isLoaded) {
      const seekTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  }, [duration, isLoaded]);

  return {
    currentTime,
    duration,
    isPlaying,
    isLoaded,
    togglePlay,
    seek,
    audioRef,
  };
};