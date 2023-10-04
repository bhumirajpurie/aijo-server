import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";
import User from "../models/User.js";

// Get All Affiliate
export const getAffiliates = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: "affiliate" });
  if (!users) throw createError(404, `No affiliates found`);
  res.status(200).send({ status: "success", data: users });
});

// Get Single User
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id, { role: "affiliate" });

  if (!user)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  res.status(200).send({ status: "success", data: user });
});

// Create Affiliate
export const createAffiliate = catchAsync(async (req, res, next) => {
  await User.create({ ...req.body, role: "affiliate", isVerified: true });
  res
    .status(201)
    .send({ status: "success", message: `Affiliate created successfully` });
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
