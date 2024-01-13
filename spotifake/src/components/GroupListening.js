import React, { useState } from "react";

function GroupListening() {
  const [sessionID, setSessionID] = useState("");

  const handleCreateSession = () => {
    // Logique pour créer une nouvelle session
    // Générer un ID de session unique
    // setSessionID( /* ID généré */ );
  };

  const handleJoinSession = () => {
    // Logique pour rejoindre une session existante
    // Utiliser l'ID de session entré par l'utilisateur
  };

  return (
    <div>
      <h1>Écoute de Groupe</h1>
      <button onClick={handleCreateSession}>Créer une Session</button>
      <div>
        <input
          type="text"
          placeholder="Entrer ID de Session"
          value={sessionID}
          onChange={(e) => setSessionID(e.target.value)}
        />
        <button onClick={handleJoinSession}>Rejoindre une Session</button>
      </div>
    </div>
  );
}

export default GroupListening;
