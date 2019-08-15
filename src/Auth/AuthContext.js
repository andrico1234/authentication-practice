import React, { createContext } from "react";
import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";

const AuthContext = createContext({});

export const AuthConsumer = AuthContext.Consumer;

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

    this.userProfile = null;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("scopes");
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        debugger;
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
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    const scopes = authResult.scopes || this.requestedScopes || "";

    localStorage.setItem("accessToken", authResult.accessToken);
    localStorage.setItem("idToken", authResult.idToken);
    localStorage.setItem("expiresAt", expiresAt);
    localStorage.setItem("scopes", JSON.stringify(scopes));
  };

  isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem("expiresAt"));

    return expiresAt > new Date().getTime();
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    return accessToken;
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
    const grantedScopes = JSON.parse(
      localStorage.getItem("scopes") || ""
    ).split(" ");

    return scopes.every(scope => grantedScopes.includes(scope));
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
          userHasScopes: this.userHasScopes
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContext;