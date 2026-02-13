import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const AudioController = () => {
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const { status, collisionPos } = useGameStore();

  useEffect(() => {
    const bgMusic = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    bgMusicRef.current = bgMusic;

    const explosionSound = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
    explosionSound.volume = 0.8;
    explosionSoundRef.current = explosionSound;

    return () => {
      bgMusic.pause();
      bgMusicRef.current = null;
      explosionSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (status === 'PLAYING') {
      bgMusicRef.current.play().catch(() => {});
    } else if (status === 'START') {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, [status]);

  useEffect(() => {
    if (collisionPos && explosionSoundRef.current) {
      explosionSoundRef.current.currentTime = 0;
      explosionSoundRef.current.play().catch(() => {});
    }
  }, [collisionPos]);

  return null;
};
