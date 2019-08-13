import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ render, auth, path, scopes }) {
  return (
    <Route
      path={path}
      render={props => {
        if (!auth.isAuthenticated()) {
          return auth.login();
        }

        if (!auth.userHasScopes(scopes)) {
          return <Redirect to="error" />
        }

        return render(props);
      }}
    />
  );
}

export default ProtectedRoute;
