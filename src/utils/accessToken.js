import jwt from "jsonwebtoken";
import { env } from "../../config/env.config";

export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
     env.ACCESS_TOKEN_SECRET,
    {
      env.ACCESS_TOKEN_EXPIRY
    }
  );
};
