const express = require("express");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const checkScope = require("express-jwt-authz");
require("dotenv").config();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"]
});

const app = express();

function checkRole(role) {
  return function(req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    }

    return res.status(401).send("Insufficient role");
  };
}

app.get("/public", function(req, res) {
  res.json({
    message: "Hello from the api"
  });
});

app.get("/private", checkJwt, function(req, res) {
  res.json({
    message: "Hello from the secret api"
  });
});

app.get("/admin", checkJwt, checkRole("admin"), function(req, res) {
  res.json({
    message: "Admins"
  });
});

app.get("/courses", checkJwt, checkScope(["read:courses"]), function(req, res) {
  res.json({
    courses: [
      {
        id: "course-one",
        name: "javascript"
      },
      {
        id: "course-two",
        name: "animation"
      }
    ]
  });
});

app.listen(3001, () => {
  console.log(`listening on port ${process.env.REACT_APP_AUTH0_AUDIENCE}`);
});
