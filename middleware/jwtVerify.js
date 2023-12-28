import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Authentication failed. Please try to login again " });
  }
};
