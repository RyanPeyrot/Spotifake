import React from "react";
import { Link } from "react-router-dom";

const defaultImage = "https://d2be9zb8yn0dxh.cloudfront.net/";

function AlbumCard({ album }) {
  const albumName = album.isAlbum ? album.name : album.title;

  return (
    <Link to={`/album/${album._id}`} className="no-underline">
      {" "}
      {/* Assurez-vous que `album._id` est la clé correcte */}
      <div className="bg-gray-800 text-white rounded-lg m-2 overflow-hidden shadow-lg">
        <img
          src={album.thumbnail || defaultImage}
          alt={albumName}
          className="w-full object-cover"
          style={{ height: "200px" }}
        />
        <div className="p-4">
          <h3 className="text-lg font-bold">{albumName}</h3>
          <p className="text-gray-400">
            {album.artists?.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default AlbumCard;
