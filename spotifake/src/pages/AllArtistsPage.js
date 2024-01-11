import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";

const API_BASE_URL = "http://13.37.240.115:4000/spotifake-ral/v1";

function AllArtistsPage() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/artists`)
      .then((res) => res.json())
      .then(setArtists)
      .catch((error) =>
        console.error("Erreur lors de la récupération des artistes:", error)
      );
  }, []);

  const renderCard = (artist) => {
    const title = artist.name;
    const imageUrl =
      artist.thumbnail || "https://d2be9zb8yn0dxh.cloudfront.net/";
    // Assuming you have a page to display individual artist details
    const linkPath = `/artist/${artist._id}`;

    return (
      <div key={artist._id} className="group m-2">
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
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="p-8 bg-spotify-black text-white">
      <h2 className="text-2xl font-bold mb-4">Tous les Artistes</h2>
      <div className="grid grid-cols-5 gap-4">{artists.map(renderCard)}</div>
    </div>
  );
}

export default AllArtistsPage;
