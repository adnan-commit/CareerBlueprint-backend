import jwt from "jsonwebtoken";
import TokenBlacklist from "../models/blacklist.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

export const authUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  //  Check if token exists
  if (!token) {
    throw new ApiError(401, "Authentication token is missing");
  }

  //  Check blacklist
  const isTokenBlacklisted = await TokenBlacklist.findOne({ token });

  if (isTokenBlacklisted) {
    throw new ApiError(401, "Token has been blacklisted. Please log in again.");
  }

  //  Validate JWT secret
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is not defined");
  }

  //  Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //  Attach user to request
  req.user = decoded;

  return next();
});
