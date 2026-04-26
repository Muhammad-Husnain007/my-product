import jwt from "jsonwebtoken";
import { UserModel } from "../modules/user/model/user.model.js";

export const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: 401,
      error: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decoded._id).select(
      "_id username class",
    );

    if (!user) {
      return res.status(401).json({
        status: 401,
        error: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      status: 401,
      error: "Invalid or expired token",
    });
  }
};
