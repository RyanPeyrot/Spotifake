import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ArtistPage() {
  const { artistId } = useParams();
  const [topTracks, setTopTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artistDetails, setArtistDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch artist details
        const artistResponse = await fetch(
          `${API_BASE_URL}/artists/${artistId}`
        );
        const artistData = await artistResponse.json();
        setArtistDetails(artistData);

        // Fetch media related to the artist
        const mediasResponse = await fetch(
          `${API_BASE_URL}/medias?artistId=${artistId}`
        );
        const mediasData = await mediasResponse.json();

        // Check if the artist has any listens, if not get random tracks
        const hasListens = mediasData.some((media) => media.listenCount > 0);
        const sortedMedias = hasListens
          ? mediasData.sort((a, b) => b.listenCount - a.listenCount)
          : mediasData; // Or shuffle for random

        setTopTracks(sortedMedias.slice(0, 5));

        // Fetch albums related to the artist
        const albumsResponse = await fetch(
          `${API_BASE_URL}/playlists?isAlbum=true&artistId=${artistId}`
        );
        const albumsData = await albumsResponse.json();
        setAlbums(albumsData);
      } catch (error) {
        console.error("Error fetching artist data", error);
      }
    }

    fetchData();
  }, [artistId]);

  return (
    <div className="artist-page bg-gray-900 text-white">
      <header className="artist-header p-8 shadow-lg bg-black flex items-center">
        {artistDetails && (
          <>
            <img
              src={artistDetails.thumbnail || "default-thumbnail.jpg"}
              alt={artistDetails.name}
              className="w-48 h-48 object-cover mr-8"
            />
            <div>
              <h1 className="text-5xl font-bold">{artistDetails.name}</h1>
              {/* Ajoutez ici d'autres détails si vous le souhaitez */}
            </div>
          </>
        )}
      </header>

      <section className="top-tracks mt-8 p-8">
        <h2 className="text-3xl font-bold mb-4">Populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topTracks.map((track, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4"
            >
              <img
                className="w-16 h-16 object-cover rounded-full"
                src={track.thumbnail}
                alt={track.title}
              />
              <div>
                <h3 className="text-xl font-semibold">{track.title}</h3>
                <p className="text-gray-400">
                  {track.listenCount.toLocaleString()} écoutes
                </p>
                <p className="text-gray-400">{track.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="discography mt-8 p-8">
        <h2 className="text-3xl font-bold mb-4">Discographie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Ici, bouclez sur les albums pour les afficher avec une image et un titre */}
        </div>
      </section>
    </div>
  );
}

export default ArtistPage;
