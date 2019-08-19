import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./Auth/AuthContext";

function Home() {
  const { login, isAuthenticated } = useContext(AuthContext);
  const result = isAuthenticated();

  return (
    <div>
      <h1>Home</h1>
      {result ? (
        <>
          <Link to="/profile">View Profile </Link>
        </>
      ) : (
        <button onClick={login}>Log in</button>
      )}
    </div>
  );
}

export default Home;
