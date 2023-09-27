import jwt from "jsonwebtoken";

import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";

import User from "../models/User.js";

export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!(authHeader && authHeader.toLowerCase().startsWith("bearer")))
    throw createError(
      401,
      "You are not logged in. Please login to get access."
    );
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw createError(401, "Your session has expired. Please log in again.");
    } else {
      throw createError(401, "Invalid token.");
    }
  }
});

export const permission = (role) => (req, res, next) => {
  if (role !== req.user.role)
    throw createError(403, "You are not allowed to access this route.");
  next();
};
