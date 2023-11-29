import jwt from "jsonwebtoken";

import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";

import User from "../models/User.js";

export const orderAuth = catchAsync(async (req, _, next) => {
  const authHeader = req.headers.authorization;
  if (!(authHeader && authHeader.toLowerCase().startsWith("bearer"))) next();
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
