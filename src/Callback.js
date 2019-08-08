import React, { useState, useEffect } from "react";

function Callback({ location, auth }) {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    if (/access-token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
      setMounted(true);
    } else {
      throw new Error("Invalid callback URL");
    }
    // eslint-disable-next-line
  }, []);

  if (!isMounted) {
    return <h1>Loading...</h1>;
  }

  return <h1>Loaded</h1>;
}

export default Callback;
