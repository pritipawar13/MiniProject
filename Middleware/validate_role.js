const jwt = require('jsonwebtoken');

var adminauth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied: No Token Provided!');
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (decoded.role === 'admin') {
    next();
  }
  return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');
};

var superadminauth = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied: No Token Provided!');
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (decoded.role === 'superadmin') {
    next();
  }
  return res.status(401).send('Access Denied: You dont have correct privilege to perform this operation');
};

module.exports = {
  adminauth,
  superadminauth,
};
