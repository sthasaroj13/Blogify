import jwt from "jsonwebtoken";
import HttpError from "../models/error.models.js"; // Likely a custom error class

const authMiddleware = async (req, res, next) => {
  // 1. Check for Authorization Header
  const Authorization = req.headers.Authorization || req.headers.authorization;

  // 2. Handle Missing or Incorrect Header Format
  if (!Authorization || !Authorization.startsWith("Bearer")) {
    return next(new HttpError("Unauthorized. Missing or invalid token format", 422));
  }

  // 3. Extract Token
  const token = Authorization.split(" ")[1];

  // 4. Verify Token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new HttpError("Unauthorized. Invalid token", 422));
    }

    // 5. Success: Attach Decoded User Information
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
