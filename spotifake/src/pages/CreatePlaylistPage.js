import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://13.37.240.115:4000/spotifake-ral/v1";
const ITEMS_PER_PAGE = 8;

function CreatePlaylistPage() {
  const [playlistName, setPlaylistName] = useState("");
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [selectedMediaIds, setSelectedMediaIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [playlistThumbnail, setPlaylistThumbnail] = useState(null);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/medias`)
      .then((res) => res.json())
      .then(setMedias);
  }, []);

  useEffect(() => {
    const filtered = medias.filter((media) =>
      media.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedias(filtered);
  }, [searchTerm, medias]);

  const lastMediaIndex = currentPage * ITEMS_PER_PAGE;
  const firstMediaIndex = lastMediaIndex - ITEMS_PER_PAGE;
  const currentMedias = filteredMedias.slice(firstMediaIndex, lastMediaIndex);

  const toggleMediaSelection = (mediaId) => {
    setSelectedMediaIds((prevSelected) =>
      prevSelected.includes(mediaId)
        ? prevSelected.filter((id) => id !== mediaId)
        : [...prevSelected, mediaId]
    );
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const playlistData = {
      name: playlistName,
      medias: selectedMediaIds,
      creator: "VotreNomUtilisateur",
      creator: creatorName, // Utilisation du nom du créateur saisi
      createdAt: new Date().toISOString().split("T")[0],
      // Vous pouvez ajouter la logique de traitement de l'image ici si nécessaire
    };

    console.log("Données envoyées à l'API:", playlistData);

    try {
      const response = await fetch(`${API_BASE_URL}/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlistData),
      });

      if (response.ok) {
        console.log("Playlist créée avec succès");
      } else {
        console.error(
          "Erreur lors de la création de la playlist",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
    }
  };

  const handleThumbnailChange = (e) => {
    setPlaylistThumbnail(e.target.files[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-green-500 mb-4">
        Créer une nouvelle playlist
      </h1>
      <form
        className="w-full max-w-xl bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="playlistName"
          >
            Nom de la playlist
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="playlistName"
            type="text"
            placeholder="Ma super playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="playlistThumbnail"
          >
            Vignette de la playlist
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="playlistThumbnail"
            type="file"
            onChange={handleThumbnailChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="creatorName"
          >
            Nom du créateur
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="creatorName"
            type="text"
            placeholder="Entrez votre nom"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un média"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          {currentMedias.map((media) => (
            <div key={media._id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedMediaIds.includes(media._id)}
                  onChange={() => toggleMediaSelection(media._id)}
                />
                {media.title}
              </label>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Créer
          </button>
        </div>
      </form>
      <div className="pagination text-white">
        {[
          ...Array(Math.ceil(filteredMedias.length / ITEMS_PER_PAGE)).keys(),
        ].map((number) => (
          <button onClick={() => paginate(number + 1)} key={number}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CreatePlaylistPage;
