import React from "react";
import { Link } from "react-router-dom";

function Home({ auth }) {
  const result = auth.isAuthenticated();

  return (
    <div>
      <h1>Home</h1>
      {result ? (
        <>
          <Link to="/profile">View Profile </Link>
        </>
      ) : (
        <button onClick={auth.login}>Log in</button>
      )}
    </div>
  );
}

export default Home;
