import jwt from "jsonwebtoken";

async function verifyJWT(req, res, next) {
  try {
    const headers = req.headers;
    if (!headers) throw new Error("Header not present in response");

    const authorization = headers.authorization;
    if (!authorization)
      throw new Error("Authorization not present in response");

    const token = authorization.split(" ")[1];

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
