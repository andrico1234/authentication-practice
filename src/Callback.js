import React, { useState, useEffect, useContext } from "react";
import AuthContext from "./Auth/AuthContext";

function Callback({ location }) {
  const [isMounted, setMounted] = useState(false);
  const { handleAuthentication } = useContext(AuthContext);


  useEffect(() => {
    if (/access-token|id_token|error/.test(location.hash)) {
      handleAuthentication();
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
