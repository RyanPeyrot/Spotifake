import React, { useState, useEffect, useContext } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";

const API_BASE_URL = "http://13.37.240.115:4000/spotifake-ral/v1";
const predefinedGenres = ["Jazz", "Rock 'n' Roll", "Rock", "Country"];

function AllMedia() {
  const [medias, setMedias] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const { playSpecificTrack } = useContext(MusicPlayerContext);

  useEffect(() => {
    const fetchMedias = async () => {
      const response = await fetch(`${API_BASE_URL}/medias`);
      const data = await response.json();
      setMedias(data);
    };

    fetchMedias();
  }, []);

  const handleMediaClick = (media) => {
    const index = medias.findIndex((m) => m._id === media._id);
    playSpecificTrack(index, medias);
  };

  const renderCard = (media, index) => {
    const title = media.title;
    const artistName =
      media.artist && media.artist[0]
        ? media.artist[0].name
        : "Artiste Inconnu";
    const imageUrl =
      media.thumbnail || "https://d2be9zb8yn0dxh.cloudfront.net/";

    return (
      <div
        key={media._id}
        onClick={() => handleMediaClick(media)}
        className="group m-2"
      >
        <div className="relative w-[250px] h-[350px] bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center pt-4">
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
            <p className="text-sm text-gray-400 truncate">{artistName}</p>
          </div>
        </div>
      </div>
    );
  };

  const filteredMedias = medias.filter(
    (media) =>
      selectedGenre === "Tous" ||
      (media.genre && media.genre.includes(selectedGenre))
  );

  return (
    <div className="p-8 bg-spotify-black text-white">
      <h2 className="text-2xl font-bold mb-4">Tous les Médias</h2>
      <div className="mb-4">
        <label htmlFor="genre-select" className="text-lg">
          Choisir un genre:
        </label>
        <select
          id="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="ml-2 text-black"
        >
          <option value="Tous">Tous les genres</option>
          {predefinedGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {filteredMedias.map((media, index) => renderCard(media, index))}
      </div>
    </div>
  );
}

export default AllMedia;
