import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./Auth/AuthContext";

function Private() {
  const [message, setMessage] = useState("");
  const { getAccessToken } = useContext(AuthContext);


  useEffect(() => {
    async function getInitialData() {
      try {
        const res = await fetch(`/private`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });
        const parsedResponse = await res.json();
        setMessage(parsedResponse.message);
      } catch (e) {
        setMessage("error loading", e.message);
      }
    }

    getInitialData();
    // eslint-disable-next-line
  }, []);
  return <h1>Public {message}</h1>;
}

export default Private;
