import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register",validate(registerSchema), register);

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authLimiter, validate(loginSchema),  login);

/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.post("/logout", logout);

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access Private
 */
authRouter.get("/get-me", authUser, getMe);

/**
 * @route GET /api/auth/delete-account
 * @description delete the current logged in user account along with all his reports
 * @access Private
 */
authRouter.delete("/delete-account", authUser, deleteAccount);


export default authRouter;