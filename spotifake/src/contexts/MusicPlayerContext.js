import React, { createContext, useState, useRef } from "react";

export const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]); // Votre liste de pistes
  const audioRef = useRef(new Audio());

  // Fonction pour jouer un morceau spécifique
  const playSpecificTrack = (trackIndex, trackList) => {
    setTracks(trackList);
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    audioRef.current.src = trackList[trackIndex].storage;
    audioRef.current.play();
  };

  const value = {
    isPlaying,
    setIsPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    tracks,
    setTracks,
    audioRef,
    playSpecificTrack, // Ajoutez la fonction ici
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
