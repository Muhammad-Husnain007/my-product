import cors from "cors";
import { env } from "./env.config.js";

const allowedOrigins = env.CORS_ORIGIN?.split(",") || ["*"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

export default cors(corsOptions);
