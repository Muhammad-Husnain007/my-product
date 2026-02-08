import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import { env } from "../../config/env.config";

export const authMiddleware = (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(
      new ApiError({
        status: 401,
        error: "Unauthorized"
      })
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(
      new ApiError({
        status: 401,
        error: "Invalid or expired token"
      })
    );
  }
};
