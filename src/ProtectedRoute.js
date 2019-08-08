import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ render, auth }) {
  return (
    <Route
      path="/profile"
      render={props => {
        if (!auth.isAuthenticated()) {
          return <Redirect to="/" />;
        }

        return render(props);
      }}
    />
  );
}

export default ProtectedRoute;
