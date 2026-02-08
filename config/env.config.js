import dotenv from "dotenv";
dotenv.config();

const required = [
  "PORT",
  "MONGO_URI",
  "CORS_ORIGIN",
  "NODE_ENV",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
});

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  NODE_ENV: process.env.NODE_ENV || "development",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY
};
