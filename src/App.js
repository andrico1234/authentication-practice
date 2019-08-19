import React from "react";
import Nav from "./Nav";
import Body from "./Body";
import { AuthProvider } from "./Auth/AuthContext";

function App({ history }) {
  return (
    <AuthProvider history={history}>
      <Nav />
      <Body />
    </AuthProvider>
  );
}

export default App;
