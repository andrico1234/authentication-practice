import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Public from "./Public";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import ProtectedRoute from "./ProtectedRoute";
import Private from "./Private";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.auth = new Auth(props.history);
  }

  render() {
    return (
      <>
        <Nav auth={this.auth} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth={this.auth} {...props} />}
          />
          <Route
            path="/callback"
            render={props => <Callback auth={this.auth} {...props} />}
          />
          <Route path="/public" component={Public} />
          <ProtectedRoute
            path="/private"
            auth={this.auth}
            render={props => <Private auth={this.auth} {...props} />}
          />
          <ProtectedRoute
            path="/profile"
            auth={this.auth}
            render={props => <Profile auth={this.auth} {...props} />}
          />
        </div>
      </>
    );
  }
}

export default App;
