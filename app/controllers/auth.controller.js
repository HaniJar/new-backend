const db = require("../models");
const config = require("../config/auth.config");
const customers = db.customers;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  // Save User to Database
  customers
    .create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
    .then((customers) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          customers.setRoles(roles).then(() => {
            res.send({ message: "customer was registered successfully!" });
          });
        });
      } else {
        // customer role = 1
        customers.setRoles([1]).then(() => {
          res.send({ message: "customer was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  customers
    .findOne({
      where: {
        username: req.body.username,
      },
    })
    .then((customers) => {
      if (!customers) {
        return res.status(404).send({ message: "customer Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        customers.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: customers.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];
      CustomElementRegistry.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: customers.id,
          username: customers.username,
          email: customers.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
