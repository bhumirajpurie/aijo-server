import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";
import User from "../models/User.js";
import verificationCode from "../utils/verificationCode.js";
import verifyEmail from "../utils/verifyEmail.js";

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
  const user = await User.findById(req.user).select(
    "-password -verificationCode -__v -createdAt -updatedAt"
  );

  if (!user) throw createError(404, `User is not found with id of ${req.user}`);

  res.status(200).send({ status: "success", user });
});

// Create User
export const createUser = catchAsync(async (req, res, next) => {
  const code = verificationCode();
  const userRole = req.body?.role || "user";
  const user = await User.create({ ...req.body, verificationCode: code });
  // Send verification email
  const mailOptions = {
    email: user.email,
    subject: "Account Verification",
    code: code,
    name: user.firstName + " " + user.lastName,
  };

  verifyEmail(mailOptions);
  // Create Job Schedule
  const job = scheduleJob("59 * * * *", user.email);
  job.start();

  res
    .status(201)
    .send({ status: "success", message: `${userRole} created successfully` });
});

// Update User
export const updateUser = catchAsync(async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, birthDate, gender } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phoneNumber, birthDate, gender },
      {
        new: true,
      }
    );

    if (!updatedUser)
      throw createError(404, `User is not found with id of ${req.params.id}`);

    res.status(201).send({ status: "success", data: updatedUser });
  } catch (error) {
    res.status(422).json({
      status: "fail",
      message: error.message,
    });
  }
});

// update address book
export const updateAddressBook = catchAsync(async (req, res, next) => {
  const { address } = req.body;
  const user = await User.findById(req.user);
  if (!user) throw createError(404, `User is not found with id of ${req.user}`);
  user.address.push(address);
  await user.save();
  res
    .status(201)
    .send({ status: "success", message: "address book updated successfully" });
});
// Delete User
export const deleteUser = catchAsync(async (req, res, next) => {
  const deleteUser = await User.findById(req.params.id);
  if (!deleteUser)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  await User.findByIdAndRemove(req.params.id);
  res
    .status(200)
    .send({ status: "success", message: "User Deleted Successfully" });
});
// change isVerified status of user
export const verifyUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw createError(404, `User not found`);
    user.isVerified = !user.isVerified;
    const newUser = await user.save();
    res.status(200).send({
      status: "success",
      message: "User verified changed successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
