import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(
      {
        status: 401,
        error: "Unauthorized"
      }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(
      {
        status: 401,
        error: "Invalid or expired token"
      }
    );
  }
};
