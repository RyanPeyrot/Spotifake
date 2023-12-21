import React from "react";

function PlaylistCard({ playlist }) {
  return (
    <div className="bg-gray-800 text-white rounded-lg m-2 overflow-hidden shadow-lg">
      <img
        src={playlist.imageUrl}
        alt={playlist.name}
        className="w-full object-cover"
        style={{ height: "200px" }}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{playlist.name}</h3>
        <p className="text-gray-400">{playlist.description}</p>
      </div>
    </div>
  );
}

export default PlaylistCard;
