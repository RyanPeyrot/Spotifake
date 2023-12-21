import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext"; // Assurez-vous que le chemin d'importation est correct

const API_BASE_URL = "http://13.37.240.115:4000/spotifake-ral/v1";

function AlbumPage() {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [mediaDetails, setMediaDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playingMedia, setPlayingMedia] = useState(null); // Ajout d'un état pour le média en cours de lecture
  const audioRefs = useRef(new Map()); // Utilisation d'un ref pour stocker les références des éléments audio
  const [currentAudio, setCurrentAudio] = useState(new Audio());
  // Contexte pour contrôler le lecteur de musique global
  const { audioRef, setCurrentTrackIndex, isPlaying, setIsPlaying, setTracks } =
    useContext(MusicPlayerContext);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/playlists/${id}`)
      .then((res) => res.json())
      .then((albumData) => {
        setAlbumDetails(albumData);

        // Mise à jour des détails des médias avec la gestion des artistes
        const updatedMediaDetails = albumData.medias.map((media) => {
          const artistName =
            media.artist && media.artist.length > 0
              ? media.artist[0].name
              : "Artiste inconnu";
          return { ...media, artistName };
        });
        setMediaDetails(updatedMediaDetails);

        const updatedTracks = albumData.medias.map((media) => ({
          ...media,
          thumbnail:
            media.thumbnail || "https://d2be9zb8yn0dxh.cloudfront.net/", // Utilisez la vignette du média
          title: media.title,
          artist:
            media.artist && media.artist.length > 0
              ? media.artist[0].name
              : "Artiste inconnu",
        }));
        setTracks(updatedTracks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'album:", error);
        setIsLoading(false);
      });
  }, [id, setTracks]);

  useEffect(() => {
    // Définir le gestionnaire onended pour l'audio actuel
    const handleAudioEnd = () => {
      let nextIndex = (playingMedia + 1) % mediaDetails.length;
      const nextMedia = mediaDetails[nextIndex];
      if (nextMedia) {
        audioRef.current.src = nextMedia.storage || defaultAudio;
        audioRef.current.play();
        setPlayingMedia(nextIndex);
        setCurrentTrackIndex(nextIndex);
      }
    };

    if (audioRef.current) {
      audioRef.current.onended = handleAudioEnd;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, [playingMedia, mediaDetails, setPlayingMedia, setCurrentTrackIndex]);

  // Fonction pour incrémenter le nombre d'écoutes
  const incrementListenCount = async (media, mediaIndex) => {
    const newListenCount = media.listenCount + 1;

    try {
      await fetch(`${API_BASE_URL}/medias/${media._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listenCount: newListenCount }),
      });

      const updatedMedias = [...mediaDetails];
      updatedMedias[mediaIndex] = { ...media, listenCount: newListenCount };
      setMediaDetails(updatedMedias);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nombre d'écoutes", error);
    }
  };

  const togglePlayPause = (media, mediaIndex) => {
    // Vérifiez si la piste actuelle est celle que vous voulez jouer/pauser
    const isCurrentTrack = playingMedia === mediaIndex;

    // Si la piste actuelle est en cours de lecture, mettez-la en pause
    if (isPlaying && isCurrentTrack) {
      audioRef.current.pause();
      setIsPlaying(false); // Mettez à jour l'état local et global
      setPlayingMedia(null); // Réinitialiser la piste en cours de lecture
    } else {
      // Si une autre piste était en cours de lecture, mettez-la en pause
      if (playingMedia !== null && playingMedia !== mediaIndex) {
        audioRef.current.pause();
        setIsPlaying(false); // Mettez à jour l'état local et global
      }

      // Jouez la nouvelle piste sélectionnée
      audioRef.current.src = media.storage || defaultAudio;
      audioRef.current.play();
      setIsPlaying(true); // Mettez à jour l'état local et global
      setPlayingMedia(mediaIndex); // Mettez à jour la piste en cours de lecture
      setCurrentTrackIndex(mediaIndex); // Mettez à jour l'indice de la piste dans le contexte global
    }

    // Si la nouvelle piste est jouée
    if (!isPlaying || playingMedia !== mediaIndex) {
      incrementListenCount(media, mediaIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-spotify-green">Chargement en cours...</div>
      </div>
    );
  }

  if (!albumDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-spotify-green">Aucun album trouvé.</div>
      </div>
    );
  }

  // Fonction pour formater la durée des médias
  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  const defaultThumbnail = "https://d2be9zb8yn0dxh.cloudfront.net/";
  const defaultAudio =
    "https://d2be9zb8yn0dxh.cloudfront.net/media/media_01 - Blueberry Hill.m4a";

  return (
    <div className="bg-spotify-black text-spotify-white min-h-screen p-8">
      {/* Album Header */}
      <div className="flex items-end space-x-6 mb-6">
        <img
          className="w-48 h-48 object-cover"
          src={defaultThumbnail}
          alt={`Couverture de l'album ${albumDetails?.name}`}
        />
        <div>
          <h1 className="text-5xl font-bold">{albumDetails.name}</h1>
          <p className="text-lg">{albumDetails.creator}</p>
          <p className="text-sm text-spotify-grey">
            {new Date(albumDetails.createdAt).getFullYear()}
          </p>
        </div>
      </div>

      {/* Media List */}
      <div className="overflow-hidden rounded-lg shadow-md bg-spotify-dark mt-8">
        <table className="w-full">
          <thead>
            <tr className="text-spotify-grey">
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Titre</th>
              <th className="py-3 px-6">Artiste</th>
              <th className="py-3 px-6">Lectures</th>
              <th className="py-3 px-6">Durée</th>
            </tr>
          </thead>
          <tbody>
            {mediaDetails.map((media, index) => (
              <tr
                key={media._id || index}
                className="border-b border-spotify-grey hover:bg-spotify-grey/10"
              >
                <td className="px-6 py-4 flex items-center group">
                  <button
                    onClick={() => togglePlayPause(media, index)}
                    className="focus:outline-none"
                  >
                    {playingMedia === index ? (
                      isPlaying ? (
                        // Icône de pause si le média est en cours de lecture
                        <svg
                          className="w-6 h-6 text-spotify-green"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                          />
                        </svg>
                      ) : (
                        // Icône de lecture si le média est en pause
                        <svg
                          className="w-6 h-6 text-spotify-green"
                          viewBox="0 0 24 24"
                        >
                          <path fill="currentColor" d="M8 5v14l11-7z" />
                        </svg>
                      )
                    ) : (
                      <span className="ml-4">{index + 1}</span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">{media.title}</td>
                <td className="px-6 py-4">{media.artist.name}</td>
                <td className="px-6 py-4">
                  {media.listenCount.toLocaleString()}
                </td>
                <td className="px-6 py-4">{/* Durée du média ici */}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlbumPage;
