import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";
import { MusicPlayerContext } from "../contexts/MusicPlayerContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AllAlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const { playSpecificTrack } = useContext(MusicPlayerContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/playlists?isAlbum=true`)
      .then((res) => res.json())
      .then(setAlbums)
      .catch((error) =>
        console.error("Erreur lors de la récupération des albums:", error)
      );
  }, []);

  const renderCard = (album) => {
    const title = album.name;
    const imageUrl =
      album.thumbnail || "https://d2be9zb8yn0dxh.cloudfront.net/";
    const linkPath = `/album/${album._id}`;

    return (
      <div key={album._id} className="group m-2">
        <Link to={linkPath} className="no-underline">
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
              <p className="text-sm text-gray-400 truncate">{album.creator}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="p-8 bg-spotify-black text-white">
      <h2 className="text-2xl font-bold mb-4">Tous les Albums</h2>
      <div className="grid grid-cols-5 gap-4">{albums.map(renderCard)}</div>
    </div>
  );
}

export default AllAlbumsPage;
