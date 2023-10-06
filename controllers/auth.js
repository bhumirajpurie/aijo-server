import crypto from "crypto";

import catchAsync from "../utils/catchAsync.js";
import verifyEmail from "../utils/verifyEmail.js";
import verificationCode from "../utils/verificationCode.js";
import createError from "../utils/createError.js";
import scheduleJob from "../utils/scheduleJob.js";
import sendEmail from "../utils/sendMail.js";

import User from "../models/User.js";

export const signupUser = catchAsync(async (req, res) => {
  // Generate random code
  const code = verificationCode();

  // Create user
  const user = await User.create({
    ...req.body,
    verificationCode: code,
  });

  // Send verification email
  const mailOptions = {
    email: user.email,
    subject: "Account Verification",
    code: code,
    name: user.firstName + " " + user.lastName,
  };

  await verifyEmail(mailOptions);

  // Create Job Schedule
  const job = scheduleJob("59 * * * *", user.email);
  job.start();

  // Send response
  res.status(201).json({
    status: "success",
    message: "Verification code has been sent to your email.",
  });
});

export const verificationEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    verificationCode: req.body.verificationCode,
  });

  if (!user) throw createError(401, "Invalid verification code");

  // Check if the request is for updating email
  if (user.newEmail) {
    user.email = user.newEmail;
    user.newEmail = undefined;
    await user.save();

    return res
      .status(200)
      .send({ status: "success", message: "Email updated successfully" });
  }

  if (user.isVerified)
    throw createError(401, "You are already verified. Login in to continue.");

  user.isVerified = true;
  user.verificationCode = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const userRole = req.body?.role || "user";
  const user = await User.findOne({
    email: req.body.email,
    isVerified: true,
    role: userRole,
  }).select("+password");
  if (!user) throw createError(401, `Email doesn't match`);

  if (!user.isVerified) {
    throw createError(401, `Please verify your email before logging in`);
  }

  const isPassword = await user.matchPassword(req.body.password);
  if (!isPassword) throw createError(401, `Password doesn't match`);
  sendTokenResponse(user, 200, res);
});

export const updateDetails = catchAsync(async (req, res, next) => {
  const newDetails = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  const updatedDetails = await User.findByIdAndUpdate(
    req.user._id,
    newDetails,
    {
      new: true,
    }
  );

  res.status(200).send({ status: "success", data: updatedDetails });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  //compare currentPassword
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch)
    throw createError(
      400,
      `Current password ${req.body.currentPassword} does't match`
    );

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

export const updateEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Check if the new email is already in use
  const user = await User.findOne({ email });
  if (user) {
    throw createError(400, "Email already in use, please try another email.");
  }

  // Generate random code
  const code = verificationCode();

  // Update the user's email
  req.user.newEmail = email;
  req.user.verificationCode = code;
  await req.user.save();

  // Send verification email to the new email address
  // const verificationURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/auth/verify-email/${verificationToken}`;

  // Send verification email
  const mailOptions = {
    email: email,
    subject: "Account Verification",
    code: code,
    name: req.user.firstName + " " + req.user.lastName,
  };

  await verifyEmail(mailOptions);

  // Send response
  res.status(201).json({
    status: "success",
    message: `Verification code has been sent to ${email}.`,
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    throw createError(400, `User with email ${req.body.email} is not found`);

  const resetToken = user.getResetPasswordToken();

  await user.save();

  try {
    const resetUrl = `http://localhost:8081/api/v1/auth/reset-password/?token=${resetToken}`;

    const message = `You are receiving this email because you (or someone else ) has
    requested the reset of a password.`;

    const options = {
      email: user.email,
      subject: "Password reset token",
      message,
      url: resetUrl,
    };

    await sendEmail(options);

    res
      .status(200)
      .send({ status: "success", message: "ResetPassword token Email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw createError(500, "Email couldn't be sent");
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
  });

  if (user.resetPasswordExpire <= Date.now()) {
    throw createError(
      400,
      `Password reset token has expired. Please try again.`
    );
  }

  if (!user) throw createError(400, `Invalid token ${req.body.token}`);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res
    .status(200)
    .send({ status: "success", message: "Your Password has been changed" });
});

const sendTokenResponse = (userData, statusCode, res) => {
  const token = userData.getSignedToken();
  res.status(statusCode).json({ status: "success", token });
};
