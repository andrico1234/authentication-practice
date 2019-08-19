import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "./Auth/AuthContext";

function ProtectedRoute({ render, path, scopes = [] }) {
  const auth = useContext(AuthContext);
  const { login, isAuthenticated, userHasScopes } = auth;

  return (
    <Route
      path={path}
      render={props => {
        if (!isAuthenticated()) {
          return login();
        }

        if (!userHasScopes(scopes)) {
          return <Redirect to="error" />;
        }

        return render({ ...props, auth });
      }}
    />
  );
}

export default ProtectedRoute;
