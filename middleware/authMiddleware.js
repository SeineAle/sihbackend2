import jsonwebtoken from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = decoded.userId;
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
  next();
};

export default authMiddleware;