import React, { createContext } from "react";
import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

const AuthContext = createContext({});

export const AuthConsumer = AuthContext.Consumer;

// eslint-disable-next-line
let _idToken = null;
let _accessToken = null;
let _scopes = "";
let _expiresAt = null;

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);

    this.history = props.history;
    this.userProfile = null;
    this.requestedScopes = "openid profile email read:courses";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URI,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.requestedScopes
    });

    this.state = {
      tokenRenewalComplete: false
    };
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );

    this.auth0.authorize();
  };

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:3000"
    });
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);

        const redirectLocation =
          localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
            ? "/"
            : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN)).pathname;

        this.history.push(redirectLocation);
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}`);
        console.log(err);
      }

      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  setSession = authResult => {
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    _scopes = authResult.scopes || this.requestedScopes || "";
    _accessToken = authResult.accessToken;
    _idToken = authResult.idToken;

    this.scheduleTokenRenewal();
  };

  isAuthenticated = () => {
    return _expiresAt > new Date().getTime();
  };

  getAccessToken = () => {
    if (!_accessToken) {
      throw new Error("No access token found");
    }

    return _accessToken;
  };

  getProfile = cb => {
    if (this.userProfile) {
      return cb(this.userProfile);
    }

    const accessToken = this.getAccessToken();

    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }

      cb(profile, err);
    });
  };

  userHasScopes = scopes => {
    const grantedScopes = _scopes.split(" ");

    return scopes.every(scope => grantedScopes.includes(scope));
  };

  renewToken = () => {
    this.auth0.checkSession({}, (err, authResult) => {
      if (err) {
        console.log(err);
      } else {
        this.setSession(authResult);
      }

      this.setState({
        tokenRenewalComplete: true
      });
    });
  };

  scheduleTokenRenewal = () => {
    const delay = _expiresAt - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          login: this.login,
          logout: this.logout,
          handleAuthentication: this.handleAuthentication,
          setSession: this.setSession,
          isAuthenticated: this.isAuthenticated,
          getAccessToken: this.getAccessToken,
          getProfile: this.getProfile,
          userHasScopes: this.userHasScopes,
          renewToken: this.renewToken,
          tokenRenewalComplete: this.state.tokenRenewalComplete
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContext;
