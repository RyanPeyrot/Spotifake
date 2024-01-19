import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import ArtistCard from "../components/ArtistCard";
import AlbumCard from "../components/AlbumCard";
import PlaylistCard from "../components/PlaylistCard";

function SearchPage() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    artists: [],
    albums: [],
    playlists: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const artistsResponse = await fetch(`${API_BASE_URL}/artists`);
      const artistsData = await artistsResponse.json();

      const playlistsResponse = await fetch(`${API_BASE_URL}/playlists`);
      const playlistsData = await playlistsResponse.json();

      const filteredArtists = artistsData.filter((artist) =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Find albums related to the searched artist
      const filteredAlbums = playlistsData.filter(
        (playlist) =>
          playlist.isAlbum &&
          filteredArtists.some((artist) => artist.name === playlist.creator)
      );

      const filteredPlaylists = playlistsData.filter(
        (playlist) =>
          !playlist.isAlbum &&
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults({
        artists: filteredArtists,
        albums: filteredAlbums,
        playlists: filteredPlaylists,
      });
    };

    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm, API_BASE_URL]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-spotify-black p-8">
      <SearchBar value={searchTerm} onChange={handleSearchChange} />
      <div className="mt-4">
        {searchTerm && (
          <h2 className="text-xl text-white mb-3">
            Résultats pour "{searchTerm}"
          </h2>
        )}

        {searchResults.artists.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg mb-2">Artistes</h3>
            <div className="flex flex-wrap">
              {searchResults.artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </div>
        )}

        {searchResults.albums.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg mb-2">Albums</h3>
            <div className="flex flex-wrap">
              {searchResults.albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>
        )}

        {searchResults.playlists.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg mb-2">Playlists</h3>
            <div className="flex flex-wrap">
              {searchResults.playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
