const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers.authorization || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({message: "You are not authorized"});
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.client = decoded;
  } catch (err) {
    return res.status(401).send({message: "Invalid Token"});
  }
  return next();
};

module.exports = verifyToken;
