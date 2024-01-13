import React, { useState, useEffect } from "react";
import axios from "axios";

function GroupListeningPage() {
  const [sessionID, setSessionID] = useState("");
  const [inSession, setInSession] = useState(false);
  const [userList, setUserList] = useState([]);

  const generateRandomUsername = () => {
    const adjectives = [
      "Rapide",
      "Intelligent",
      "Vif",
      "Mystérieux",
      "Silencieux",
    ];
    const nouns = ["Panda", "Lynx", "Aigle", "Tigre", "Loup"];
    return (
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      "_" +
      nouns[Math.floor(Math.random() * nouns.length)]
    );
  };

  const handleCreateSession = async () => {
    try {
      const newUser = generateRandomUsername();
      const response = await axios.post(
        "http://13.37.240.115:4000/spotifake-ral/v1/sessions",
        { user: newUser }
      );

      const newSessionID = response.data._id;
      setSessionID(newSessionID);
      setInSession(true);
      setUserList((prevUserList) => [...prevUserList, newUser]); // Ajoute le nouvel utilisateur à la liste
    } catch (error) {
      console.error("Erreur lors de la création de la session", error);
    }
  };

  const handleLeaveSession = async (username) => {
    try {
      // Supprimer l'utilisateur de la liste
      const updatedUserList = userList.filter((user) => user !== username);
      setUserList(updatedUserList);

      if (updatedUserList.length === 0) {
        // S'il n'y a plus d'utilisateurs, supprimer la session
        await axios.delete(
          `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`
        );
        setSessionID("");
        setInSession(false);
      } else {
        // Mettre à jour la session avec les utilisateurs restants
        await axios.put(
          `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`,
          { users: updatedUserList }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la sortie de la session", error);
    }
  };
  const handleJoinSession = async () => {
    if (sessionID) {
      try {
        const newUser = generateRandomUsername();
        await axios.put(
          `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`,
          { user: newUser }
        );
        // Récupérer l'état de la session après avoir rejoint pour obtenir la liste des utilisateurs mise à jour
        const sessionResponse = await axios.get(
          `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`
        );
        setInSession(true);
        setUserList(sessionResponse.data.users); // Mettre à jour l'état avec la liste des utilisateurs de la réponse de l'API
      } catch (error) {
        console.error("Erreur lors de la jointure de la session", error);
      }
    } else {
      alert("Veuillez entrer un ID de session valide.");
    }
  };

  return (
    <div className="bg-spotify-black text-white min-h-screen flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Écoute de Groupe</h1>
      {!inSession && (
        <div className="space-y-4">
          <button
            className="bg-spotify-green text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
            onClick={handleCreateSession}
          >
            Créer une Session
          </button>
          <div className="flex flex-col items-center">
            <input
              type="text"
              className="text-black p-2 rounded"
              placeholder="Entrer ID de Session"
              value={sessionID}
              onChange={(e) => setSessionID(e.target.value)}
            />
            <button
              className="bg-spotify-green text-white py-2 px-4 mt-2 rounded-full hover:bg-green-700 transition duration-300"
              onClick={handleJoinSession}
            >
              Rejoindre une Session
            </button>
          </div>
        </div>
      )}
      {inSession && (
        <div>
          <h2 className="text-xl">Session ID: {sessionID}</h2>
          <div>
            <h3>Utilisateurs dans la session :</h3>
            <ul>
              {userList.map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupListeningPage;
