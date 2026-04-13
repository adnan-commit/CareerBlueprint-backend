import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import TokenBlacklist from "../models/blacklist.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

/**
 * @name register
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hash,
  });

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    },
  });
});

/**
 * @name login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      token: token,
    },
  });
});

/**
 * @name logout
 */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    await TokenBlacklist.create({
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

/**
 * @name getMe
 */
export const getMe = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

/**
 * @name deleteAccount
 */

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  //  This will trigger cascade delete automatically
  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  //  Blacklist token (optional but best)
  const token = req.cookies?.token;

  if (token) {
    await TokenBlacklist.create({
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  //  Clear cookie
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Account and all related data deleted successfully",
  });
});