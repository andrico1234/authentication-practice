import React, { useState, useEffect } from "react";

function Private({ auth }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getInitialData() {
      try {
        const res = await fetch(`/private`, {
          headers: {
            Authorization: `Bearer ${auth.getAccessToken()}`
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
