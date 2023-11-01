import jwt from "jsonwebtoken";

async function verifyJWT(req, res, next) {
  try {
    const { token } = req.body;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) {
      return;
    }
    req.user = userId;
    next();
  } catch (error) {
    res.status(400).json("JSON WEB TOKEN Expired");
  }
}

export default verifyJWT;
