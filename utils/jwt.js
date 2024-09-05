const jwt = require('jsonwebtoken');
const config = require('../config/index');

exports.generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "7d",
  });
};
