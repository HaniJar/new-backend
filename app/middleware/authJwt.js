const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const customers = db.customers;
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.customersId = decoded.id;
    next();
  });
};
isReceptionist = (req, res, next) => {
  customers.findByPk(req.customersId).then((customers) => {
    customers.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "receptionist") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Reception Role!",
      });
      return;
    });
  });
};
isBossman = (req, res, next) => {
  customers.findByPk(req.customersId).then((customers) => {
    customers.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "bossman") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Bossman Role!",
      });
    });
  });
};
isReceptionistOrBossman = (req, res, next) => {
  customers.findByPk(req.customersId).then((customers) => {
    customers.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "receptionist") {
          next();
          return;
        }
        if (roles[i].name === "bossman") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Receptionist or Bossman Role!",
      });
    });
  });
};
const authJwt = {
  verifyToken: verifyToken,
  isBossman: isBossman,
  isReceptionist: isReceptionist,
  isReceptionistOrBossman: isReceptionistOrBossman,
};
module.exports = authJwt;
