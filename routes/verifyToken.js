const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req?.headers?.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer

    jwt.verify(token, process?.env?.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(401).json("Invalid token!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Unauthenicated!");
  }
};

const verifyTokenAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req?.user?.id === req?.params?.id || req?.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allow!");
    }
  });
};

const verifyTokenOnlyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req?.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not Admin!");
    }
  });
};

module.exports = { verifyToken, verifyTokenAuth, verifyTokenOnlyAdmin };
