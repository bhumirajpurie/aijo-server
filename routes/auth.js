import express from "express";

import {
  signupUser,
  verificationEmail,
  loginUser,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  updateEmail,
  checkAuthentication,
} from "../controllers/auth.js";

import {
  signupValidationRules,
  codeValidationRules,
  updateDetailsValidationRules,
  updatePasswordValidationRules,
  emailValidationRules,
  resetPasswordValidationRules,
} from "../validators/authValidator.js";

import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/signup",
  // signupValidationRules(),
  validate,
  signupUser
);

router.post(
  "/verify-email",
  codeValidationRules(),
  validate,
  verificationEmail
);

router.post("/login", validate, loginUser);
router.get("/check-auth", protect, validate, checkAuthentication);

router.put(
  "/update/user-details",
  protect,
  updateDetailsValidationRules(),
  validate,
  updateDetails
);

router.post(
  "/update/email",
  protect,
  emailValidationRules(),
  validate,
  updateEmail
);

router.put("/reset-email", codeValidationRules(), validate, verificationEmail);

router.put(
  "/update/password",
  protect,
  updatePasswordValidationRules(),
  validate,
  updatePassword
);

router.post(
  "/forgot-password",
  emailValidationRules(),
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidationRules(),
  validate,
  resetPassword
);

export default router;
