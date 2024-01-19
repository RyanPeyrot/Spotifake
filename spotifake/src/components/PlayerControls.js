import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedoAlt,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";
import { useSession } from "../contexts/SessionContext";
import io from "socket.io-client";

function PlayerControls() {
  const {
    isPlaying,
    setIsPlaying,
    currentTrackIndex,
    setCurrentTrackIndex,
    tracks,
    audioRef,
  } = useContext(MusicPlayerContext);
  const socket = io("http://13.37.240.115:4000/");
  const [trackProgress, setTrackProgress] = useState(0);
  const { inSession, sessionID } = useSession();
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setTrackProgress(
          audioRef.current.currentTime / audioRef.current.duration || 0
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, audioRef]);

  const onScrub = (value) => {
    audioRef.current.currentTime = value * audioRef.current.duration;
    setTrackProgress(audioRef.current.currentTime / audioRef.current.duration);
  };

  useEffect(() => {
    socket.on("mediaUpdated", (updatedSession) => {
      if (updatedSession.sessionID === sessionID) {
        const newTrackIndex = tracks.findIndex(
          (track) => track.id === updatedSession.currentMedia.id
        );
        if (newTrackIndex !== -1) {
          setCurrentTrackIndex(newTrackIndex);
          audioRef.current.src = tracks[newTrackIndex].storage;
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    });

    return () => {
      socket.off("mediaUpdated");
    };
  }, [sessionID, tracks, setCurrentTrackIndex, audioRef]);

  const onScrubStart = () => {
    if (isPlaying) {
      audioRef.current.pause();
    }
  };

  const onScrubEnd = () => {
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const playPauseHandler = () => {
    const isNowPlaying = !isPlaying;
    if (isNowPlaying) {
      audioRef.current.play();
      if (inSession) {
        socket.emit("updateMedia", {
          sessionID,
          mediaId: tracks[currentTrackIndex].id,
        });
      }
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(isNowPlaying);
  };

  const shuffleHandler = () => {
    setIsShuffle(!isShuffle); // Change l'état de shuffle à chaque clic
  };
  const loopHandler = () => {
    setIsLooping(!isLooping);
  };

  const nextTrackHandler = useCallback(() => {
    let newIndex;
    if (isShuffle) {
      newIndex = Math.floor(Math.random() * tracks.length);
    } else {
      newIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(newIndex);
    audioRef.current.src = tracks[newIndex].storage;
    audioRef.current.play();
    setIsPlaying(true);
    if (inSession) {
      socket.emit("updateMedia", {
        sessionID,
        mediaId: tracks[newIndex].id,
      });
    }
  }, [
    currentTrackIndex,
    isShuffle,
    tracks,
    setIsPlaying,
    inSession,
    sessionID,
  ]);

  useEffect(() => {
    audioRef.current.onended = () => {
      if (isLooping) {
        audioRef.current.play();
      } else {
        // Logique pour passer à la piste suivante si la boucle n'est pas activée
        nextTrackHandler();
      }
    };

    return () => {
      audioRef.current.onended = null;
    };
  }, [audioRef, isLooping, nextTrackHandler]);

  const prevTrackHandler = () => {
    let newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
    audioRef.current.src = tracks[newIndex].storage; // Assurez-vous que 'storage' est la clé correcte pour le chemin de la musique
    audioRef.current.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    audioRef.current.volume = 0.5; // Commencez avec un volume de 50%
  }, [audioRef]);

  const volumeChangeHandler = (e) => {
    const newVolume = e.target.value / 100;
    audioRef.current.volume = newVolume;
  };

  const muteHandler = () => {
    if (isMuted) {
      audioRef.current.volume = 0.5; // ou la valeur précédente avant mute
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const currentTrack = tracks[currentTrackIndex];

  const trackThumbnail = currentTrack?.thumbnail;
  const trackTitle = currentTrack?.title;
  const trackArtist = currentTrack?.artist[0]?.name;

  return (
    <div className="player-controls fixed absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-spotify-green to-spotify-dark-green backdrop-blur-lg rounded-t-3xl z-10">
      {currentTrackIndex !== null && (
        <div className="flex items-center space-x-4">
          <img
            src={trackThumbnail}
            alt={trackTitle}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <span className="block text-lg font-bold">{trackTitle}</span>
            <span className="block text-sm text-gray-300">{trackArtist}</span>
          </div>
        </div>
      )}

      {/* Contrôles du lecteur */}
      <div className="controls flex items-center justify-center">
        <FaStepBackward
          onClick={prevTrackHandler}
          className="mx-2 cursor-pointer"
        />
        {isPlaying ? (
          <FaPauseCircle
            onClick={playPauseHandler}
            className="mx-2 cursor-pointer text-3xl"
          />
        ) : (
          <FaPlayCircle
            onClick={playPauseHandler}
            className="mx-2 cursor-pointer text-3xl"
          />
        )}
        <FaStepForward
          onClick={nextTrackHandler}
          className="mx-2 cursor-pointer"
        />
      </div>

      {/* Barre de progression */}
      <div className="now-playing flex-1 flex items-center justify-center">
        {currentTrack && (
          <div className="track-info">
            <span className="track-title font-bold"></span>
            <span className="artist-name ml-2"></span>
          </div>
        )}
        <input
          type="range"
          className="progress-bar mx-4"
          value={trackProgress * 100}
          onChange={(e) => onScrub(e.target.value / 100)}
          onMouseDown={onScrubStart}
          onMouseUp={onScrubEnd}
          onKeyUp={onScrubEnd}
        />
      </div>

      {/* Contrôle du volume */}
      <div className="volume-control flex items-center justify-center">
        <FaRandom
          onClick={shuffleHandler}
          className={`mx-2 cursor-pointer ${isShuffle ? "text-green-500" : ""}`}
        />
        <FaRedoAlt
          onClick={loopHandler}
          className={`mx-2 cursor-pointer ${isLooping ? "text-green-500" : ""}`}
        />
        <FaVolumeUp
          onClick={muteHandler}
          className={`mx-2 cursor-pointer ${!isMuted ? "text-green-500" : ""}`}
        />
        {isMuted ? (
          <FaVolumeMute onClick={muteHandler} className="mx-2 cursor-pointer" />
        ) : (
          <FaVolumeUp onClick={muteHandler} className="mx-2 cursor-pointer" />
        )}
        <input
          type="range"
          className="volume-bar mx-2"
          min="0"
          max="100"
          defaultValue="50"
          onChange={volumeChangeHandler}
        />
      </div>
    </div>
  );
}

export default PlayerControls;
