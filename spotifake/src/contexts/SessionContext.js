import React, { createContext, useState, useContext } from "react";

export const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionID, setSessionID] = useState(
    localStorage.getItem("sessionID") || ""
  );
  const [inSession, setInSession] = useState(
    localStorage.getItem("inSession") === "true"
  );
  const [userList, setUserList] = useState([]);

  return (
    <SessionContext.Provider
      value={{
        sessionID,
        setSessionID,
        inSession,
        setInSession,
        userList,
        setUserList,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
