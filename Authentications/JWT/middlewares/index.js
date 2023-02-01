import rateLimit from "express-rate-limit";
import expressJwt from "express-jwt";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const requireAuth = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
