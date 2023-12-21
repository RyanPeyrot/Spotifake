import React, { useEffect, useState, useRef, useContext } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";

const API_BASE_URL = "http://13.37.240.115:4000/spotifake-ral/v1";

function HomePage() {
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [medias, setMedias] = useState([]);
  const [playingMedia, setPlayingMedia] = useState(null); // Pour le média en cours de lecture
  const [audioSrc, setAudioSrc] = useState(""); // Source du fichier audio
  const { setTracks, setCurrentTrackIndex, playSpecificTrack, audioRef } =
    useContext(MusicPlayerContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/playlists`)
      .then((res) => res.json())
      .then((data) => {
        const albumsData = data.filter((item) => item.isAlbum);
        const playlistsData = data.filter((item) => !item.isAlbum);
        setAlbums(shuffleArray(albumsData));
        setPlaylists(shuffleArray(playlistsData));
      });

    fetch(`${API_BASE_URL}/artists`)
      .then((res) => res.json())
      .then((data) => setArtists(shuffleArray(data)));

    fetch(`${API_BASE_URL}/medias`)
      .then((res) => res.json())
      .then((data) => setMedias(shuffleArray(data)));
  }, []);

  const playMedia = (media, index) => {
    setTracks(medias);
    setCurrentTrackIndex(index);
    audioRef.current.src = media.storage;
    audioRef.current.play();
  };

  const renderCard = (item, type, index) => {
    const title = type === "media" ? item.title : item.name;
    const subtitle =
      type === "media"
        ? item.artist && item.artist[0]
          ? item.artist[0].name
          : "Artiste Inconnu"
        : type === "playlist" || type === "album"
        ? item.creator
        : "";
    const imageUrl = item.thumbnail || "https://d2be9zb8yn0dxh.cloudfront.net/"; // Remplacez par votre URL d'image par défaut
    const linkPath = type === "media" ? "#" : `/album/${item._id}`;

    const handleClick = (type, item, index) => {
      if (type === "media" && medias[index]) {
        console.log("Média sélectionné:", medias[index]);
        playSpecificTrack(index, medias);
      }
    };

    return (
      <div
        key={item._id}
        className="group"
        onClick={() => handleClick(type, item, index)}
      >
        <Link to={linkPath} className="no-underline">
          <div className="relative w-[250px] h-[350px] bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out m-2 cursor-pointer flex flex-col items-center pt-4">
            <img
              src={imageUrl}
              alt={title}
              className="w-[218px] h-[218px] object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 ease-in-out">
              <FaPlayCircle className="text-white text-4xl cursor-pointer" />
            </div>
            <div className="p-4 w-full">
              <h3 className="text-lg font-bold text-white truncate">{title}</h3>
              <p className="text-sm text-gray-400 truncate">{subtitle}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const MAX_MEDIA_DISPLAY = 5;

  return (
    <div className="p-8 bg-spotify-black text-white">
      {/* Section Playlists Recommandées */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Playlists Recommandées</h2>
        <div className="grid grid-cols-5 gap-2">
          {playlists.map((playlist) => renderCard(playlist, "playlist"))}
        </div>
      </section>

      {/* Section Albums Populaires */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Albums Populaires</h2>
        <div className="grid grid-cols-5 gap-4">
          {albums.map((album) => renderCard(album, "album"))}
        </div>
      </section>

      {/* Section Artistes à Découvrir */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Artistes à Découvrir</h2>
        <div className="grid grid-cols-5 gap-4">
          {artists.map((artist) => renderCard(artist, "artist"))}
        </div>
      </section>

      {/* Section Médias */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Médias</h2>
          {medias.length > 5 && (
            <Link to="/all-medias" className="text-spotify-green">
              Afficher plus
            </Link>
          )}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {medias.slice(0, 5).map((media) => renderCard(media, "media"))}
        </div>
      </section>

      {audioSrc && <audio src={audioSrc} autoPlay />}
    </div>
  );
}

function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export default HomePage;
