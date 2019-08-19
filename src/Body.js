import React, { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Public from "./Public";
import Profile from "./Profile";
import Callback from "./Callback";
import ProtectedRoute from "./ProtectedRoute";
import Private from "./Private";
import Courses from "./Courses";
import ErrorPage from "./ErrorPage";
import AuthContext from "./Auth/AuthContext";

function Body() {
  const { tokenRenewalComplete, renewToken } = useContext(AuthContext);

  useEffect(() => {
    renewToken();
    // eslint-disable-next-line
  }, []);

  if (!tokenRenewalComplete) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="body">
      <Route path="/" component={Home} />
      <Route path="/callback" component={Callback} />
      <Route path="/public" component={Public} />
      <ProtectedRoute
        path="/private"
        render={props => <Private {...props} />}
      />
      <ProtectedRoute
        path="/courses"
        scopes={["read:courses"]}
        render={props => <Courses {...props} />}
      />
      <ProtectedRoute
        path="/profile"
        render={props => <Profile {...props} />}
      />
      <Route path="/error" component={ErrorPage} />
    </div>
  );
}

export default Body;
