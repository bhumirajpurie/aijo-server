import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";
import User from "../models/User.js";

// Get All Users
export const getUsers = catchAsync(async (req, res, next) => {
  const userRole = req.query?.role || "user";
  const users = await User.find({ role: userRole });
  if (!users) throw createError(404, `No users found`);
  res.status(200).send({ status: "success", data: users });
});
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) throw createError(404, `No users found`);
  res.status(200).send({ status: "success", data: users });
});

// Get Single User
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  res.status(200).send({ status: "success", data: user });
});

// Create User
export const createUser = catchAsync(async (req, res, next) => {
  await User.create({ ...req.body, isVerified: true });
  const userRole = req.body?.role || "user";
  res
    .status(201)
    .send({ status: "success", message: `${userRole} created successfully` });
});

// Update User
export const updateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedUser)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  res.status(201).send({ status: "success", data: updatedUser });
});

// Delete User
export const deleteUser = catchAsync(async (req, res, next) => {
  const deleteUser = await User.findById(req.params.id);

  if (!deleteUser)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  await User.findByIdAndRemove(req.params.id);
  res
    .status(204)
    .send({ status: "success", message: "User Deleted Successfully" });
});
