const jwt = require('jsonwebtoken');

function optionalAuthMiddleware(req, _res, next) {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (_error) {
    req.user = null;
  }

  return next();
}

module.exports = optionalAuthMiddleware;
