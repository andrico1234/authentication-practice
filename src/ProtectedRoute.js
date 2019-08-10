import React from "react";
import { Route } from "react-router-dom";

function ProtectedRoute({ render, auth, path }) {
  return (
    <Route
      path={path}
      render={props => {
        if (!auth.isAuthenticated()) {
          return auth.login();
        }

        return render(props);
      }}
    />
  );
}

export default ProtectedRoute;
