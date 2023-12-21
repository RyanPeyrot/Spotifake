import React from "react";

function ArtistCard({ artist }) {
  return (
    <div className="bg-gray-800 rounded p-2 m-2">
      <img
        src={artist.imageUrl}
        alt={artist.name}
        className="w-full h-32 rounded-full mb-2"
      />
      <div className="text-center text-white">
        <h3 className="text-lg">{artist.name}</h3>
        <p className="text-sm text-gray-400">Artiste</p>
      </div>
    </div>
  );
}

export default ArtistCard;
