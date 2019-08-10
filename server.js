const express = require("express");
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
require("dotenv").config();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

const app = express();

app.get("/public", function(req, res) {
  res.json({
    message: "Hello from the api"
  });
});

app.get("/private", checkJwt, function(req, res) {
  res.json({
    message: "Hello from the secret api",
  });
  // check to see if the user that was passed through has a valid token

})

app.listen(3001, () => {
  console.log(`listening on port ${process.env.REACT_APP_AUTH0_AUDIENCE}`);
});
