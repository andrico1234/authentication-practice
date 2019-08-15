import React, { useContext} from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "./Auth/AuthContext";

function ProtectedRoute({ render, path, scopes = [] }) {
  const { login, isAuthenticated, userHasScopes } = useContext(AuthContext);

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

        return render(props);
      }}
    />
  );
}

export default ProtectedRoute;
