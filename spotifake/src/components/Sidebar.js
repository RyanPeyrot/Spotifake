import React from "react";
import { FaSpotify, FaHome, FaSearch, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importez Link

function Sidebar() {
  return (
    <div className="bg-spotify-black text-white w-64 min-h-screen flex flex-col">
      <div className="flex items-center justify-center p-4">
        <FaSpotify className="text-4xl text-spotify-green mr-2" />
        <span className="font-bold text-2xl">Spotifake</span>
      </div>
      <div className="flex flex-col text-lg">
        <Link to="/" className="flex items-center p-3 hover:bg-spotify-grey">
          {" "}
          {/* Utilisez Link au lieu de a */}
          <FaHome className="text-xl mr-3" /> Accueil
        </Link>
        <Link
          to="/search"
          className="flex items-center p-3 hover:bg-spotify-grey"
        >
          {" "}
          {/* Utilisez Link au lieu de a */}
          <FaSearch className="text-xl mr-3" /> Recherche
        </Link>

        <Link
          to="/create-playlist"
          className="flex items-center p-3 hover:bg-spotify-grey"
        >
          <FaPlus className="text-xl mr-3" /> Créer une playlist
        </Link>
        {/* Continuez avec d'autres liens si nécessaire */}
      </div>
    </div>
  );
}

export default Sidebar;
