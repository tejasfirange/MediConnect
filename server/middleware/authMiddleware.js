const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  let token = null;

  // check Authorization header
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  // check token header
  else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Token missing"
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }
};

module.exports = authMiddleware;