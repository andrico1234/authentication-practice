import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Public from "./Public";
import { AuthProvider } from "./Auth/AuthContext";
import Callback from "./Callback";
import ProtectedRoute from "./ProtectedRoute";
import Private from "./Private";
import Courses from "./Courses";
import ErrorPage from "./ErrorPage";

class App extends React.Component {
  render() {
    return (
      <AuthProvider history={this.props.history}>
        <Nav/>
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback {...props} />}
          />
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
      </AuthProvider>
    );
  }
}

export default App;
