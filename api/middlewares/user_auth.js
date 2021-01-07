const jwt = require("jsonwebtoken");
const verifyJWT = (token) => {
  return new Promise(async (res, rej) => {
    try {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log(payload);
      res({
        success: true,
        payload,
      });
    } catch {
      console.log("jwt auth failed");
      res({
        success: false,
      });
    }
  });
};

const userAuth = async (req, res, next) => {
  try {
    const authorization_header = req.headers.authorization.toString();
    const token = authorization_header.split(" ")[1];
    if (!token) {
      throw new Error("NO TOKEN");
    } else {
      const res_jwt = await verifyJWT(token);
      if (!res_jwt.success) {
        throw new Error("INVALID TOKEN");
      } else {
        const payload = res_jwt.payload;
        req.user = payload.email;
        next();
      }
    }
  } catch {
    res.status(403).json({
      success: false,
    });
  }
};

module.exports = userAuth;
