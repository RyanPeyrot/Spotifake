import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

function GroupListeningPage() {
  const [sessionID, setSessionID] = useState(
    localStorage.getItem("sessionID") || ""
  );
  const [inSession, setInSession] = useState(
    localStorage.getItem("inSession") === "true"
  );
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const socket = io("http://13.37.240.115:4000/spotifake-ral/v1");

  useEffect(() => {
    if (sessionID && inSession) {
      joinSession(sessionID);
    }

    socket.on("mediaUpdated", (updatedSession) => {
      console.log("Mise à jour de la session reçue:", updatedSession);
      setUserList(updatedSession.users);
      // Ici, ajoutez la logique pour jouer le nouveau média si nécessaire
      // Par exemple, playMedia(updatedSession.currentMedia);
    });

    socket.on("updateError", (error) => {
      console.error("Erreur lors de la mise à jour:", error);
    });

    return () => {
      socket.off("mediaUpdated");
      socket.off("updateError");
    };
  }, [sessionID, inSession]);

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
      setUserList((prevUserList) => [...prevUserList, newUser]);
      localStorage.setItem("sessionID", newSessionID);
      localStorage.setItem("inSession", "true");
      socket.emit("joinSession", newSessionID); // Rejoindre la session WebSocket
    } catch (error) {
      console.error("Erreur lors de la création de la session", error);
    }
  };

  const handleLeaveSession = async () => {
    try {
      await axios.delete(
        `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`
      );
      localStorage.removeItem("sessionID");
      localStorage.removeItem("inSession");
      setSessionID("");
      setInSession(false);
      setUserList([]);
      socket.emit("leaveSession", sessionID);
      navigate("/");
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
        const sessionResponse = await axios.get(
          `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`
        );
        setInSession(true);
        setUserList(sessionResponse.data.users);
        localStorage.setItem("sessionID", sessionID);
        localStorage.setItem("inSession", "true");
        socket.emit("joinSession", sessionID);
      } catch (error) {
        console.error("Erreur lors de la jointure de la session", error);
        // Gestion d'erreur supplémentaire si nécessaire
      }
    } else {
      alert("Veuillez entrer un ID de session valide.");
    }
  };

  const joinSession = async (sessionID) => {
    try {
      const sessionResponse = await axios.get(
        `http://13.37.240.115:4000/spotifake-ral/v1/sessions/${sessionID}`
      );
      setInSession(true);
      setUserList(sessionResponse.data.users);
      socket.emit("joinSession", sessionID);
    } catch (error) {
      console.error("Erreur lors de la jointure de la session", error);
      setSessionID("");
      setInSession(false);
      localStorage.removeItem("sessionID");
      localStorage.removeItem("inSession");
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
            <button
              className="bg-red-500 text-white py-2 px-4 mt-2 rounded-full hover:bg-red-700 transition duration-300"
              onClick={handleLeaveSession}
            >
              Quitter la Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupListeningPage;
