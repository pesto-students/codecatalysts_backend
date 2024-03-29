const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.cookies["access_token"] ||
    req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json("A token is required");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODE", req.user, decode);
    req.user = decode;
  } catch (err) {
    return res.status(400).send({ error: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
