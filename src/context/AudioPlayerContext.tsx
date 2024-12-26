import React, { createContext, useState, useEffect, useContext } from "react";
import { Howl } from "howler";
import { Song, songs } from "../utils/constants";

interface AudioPlayerContextType {
  currentSong: Song;
  howlInstance: Howl | null;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  handleNextSong: () => void;
  handlePreviousSong: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined
);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [howlInstance, setHowlInstance] = useState<Howl | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (howlInstance) {
      howlInstance.unload();
    }

    if (currentSong) {
      const newHowl = new Howl({
        src: [currentSong.url],
        loop: isLooping,
        onend: () => handleNextSong(),
        onplay: () => {
          setInterval(() => {
            if (howlInstance) {
              setCurrentTime(howlInstance.seek());
            }
          }, 1000); // Update current time every second
        },
      });
      setHowlInstance(newHowl);
      if (isPlaying) newHowl.play();
    }

    // Cleanup on component unmount or song change
    return () => {
      if (howlInstance) howlInstance.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong, isLooping, isPlaying]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying && howlInstance) howlInstance.pause();
    else if (!isPlaying && howlInstance) howlInstance.play();
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex((song) => song === currentSong);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const handlePreviousSong = () => {
    const currentIndex = songs.findIndex((song) => song === currentSong);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[previousIndex]);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        howlInstance,
        isPlaying,
        isLooping,
        isShuffling,
        currentTime,
        setCurrentTime,
        playSong,
        togglePlayPause,
        handleNextSong,
        handlePreviousSong,
        toggleLoop,
        toggleShuffle,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
