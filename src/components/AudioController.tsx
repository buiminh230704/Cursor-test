import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const AudioController = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { status } = useGameStore();

  useEffect(() => {
    // Using a royalty-free synthwave-style loop if possible,
    // or a placeholder that is known to work.
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (status === 'PLAYING') {
      audioRef.current.play().catch(e => console.log("Audio play failed, needs user interaction:", e));
    } else if (status === 'GAMEOVER') {
      // Maybe lower volume or change pitch? For now just keep playing or pause
    } else if (status === 'START') {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [status]);

  return null;
};
