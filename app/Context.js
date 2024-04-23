"use client";
import { createContext, useEffect, useState } from "react";
export const MyContext = createContext();

function Context({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  useEffect(() => {
    const id = window.sessionStorage.getItem("id");
    if (id) {
      setSessionId(id);
    }
  }, []);
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/member?id=${sessionId}`)
        .then((response) => response.json())
        .then((data) => {
          const user = data.find((user) => user.id === sessionId);
          if (user) {
            setLoginUser(user);
          } else {
            console.error("No user found with the id:", sessionId);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [sessionId]);
  return (
    <MyContext.Provider value={{ sessionId, setSessionId, loginUser }}>
      {children}
    </MyContext.Provider>
  );
}

export default Context;
