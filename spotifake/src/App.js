import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import PlayerControls from "./components/PlayerControls";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CreatePlaylistPage from "./pages/CreatePlaylistPage";
import AlbumPage from "./pages/AlbumPage";
import AllMediaPage from "./pages/AllMediasPage";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext"; // Assurez-vous que l'importation correspond aux exportations de votre fichier contexte
import AllAlbumsPage from "./pages/AllAlbumsPage";
import AllArtistsPage from "./pages/AllArtistsPage";
import ArtistPage from "./pages/ArtistPage";
import GroupListeningPage from "./pages/GroupListeningPage";

function App() {
  return (
    <MusicPlayerProvider>
      {" "}
      {/* Utilisez le Provider ici pour englober toute l'application */}
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create-playlist" element={<CreatePlaylistPage />} />
              <Route path="/group-listening" element={<GroupListeningPage />} />
              <Route path="/album/:id" element={<AlbumPage />} />
              <Route path="/artist/:artistId" element={<ArtistPage />} />
              <Route path="/all-medias" element={<AllMediaPage />} />
              <Route path="/all-albums" element={<AllAlbumsPage />} />
              <Route path="/all-artists" element={<AllArtistsPage />} />
            </Routes>
            <Footer />
          </div>
          <PlayerControls />{" "}
          {/* PlayerControls aura désormais accès au contexte */}
        </div>
      </Router>
    </MusicPlayerProvider>
  );
}

export default App;
