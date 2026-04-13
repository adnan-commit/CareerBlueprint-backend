import jwt from "jsonwebtoken";
import ApiError from "./apiError.js";

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is not defined");
  }

  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;