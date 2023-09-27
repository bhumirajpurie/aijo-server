import { body } from "express-validator";
import User from "../models/User.js";

const validateName = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Firstname and Lastname are required.")
    .isLength({ min: 2 })
    .withMessage("Firstname and Lastname should be greater than two character.")
    .trim()
    .escape();
};

const validateEmail = (fields) => {
  return body(fields)
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail()
    .trim()
    .escape();
};

const validateUniqueEmail = (fields) => {
  return body(fields)
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("Email address already exists.");
      }
    })
    .normalizeEmail()
    .trim()
    .escape();
};

const validatePassword = (fields) => {
  return body(fields)
    .isLength({ min: 5, max: 25 })
    .withMessage("Password must be alteast 5 characters long.")
    .matches("[0-9]")
    .withMessage("Password must contain a number.")
    .matches("[A-Z]")
    .withMessage("Password must contain an uppercase letter.")
    .trim();
};

const validateConfirmPassword = (fields) => {
  return body(fields).custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Please enter a matching password.");
    }
    return true;
  });
};

const validateToken = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Token is required.")
    .isLength({ min: 40, max: 40 })
    .withMessage("Token must be exactly 40 characters long.")
    .trim()
    .escape();
};

export const signupValidationRules = () => [
  validateName(["firstName", "lastName"]),
  validateUniqueEmail("email"),
  validatePassword("password"),
  validateConfirmPassword("confirmPassword"),
];

export const codeValidationRules = () =>
  body("verificationCode")
    .notEmpty()
    .withMessage("Verfication code is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be exactly 6 characters long.")
    .toUpperCase()
    .trim()
    .escape();

export const loginValidationRules = () => [
  validateEmail("email"),
  validatePassword("password"),
];

export const updateDetailsValidationRules = () =>
  validateName(["firstName", "lastName"]);

export const updatePasswordValidationRules = () =>
  validatePassword(["currentPassword", "newPassword"]);

export const emailValidationRules = () => validateEmail("email");

export const resetPasswordValidationRules = () => [
  validateToken("token"),
  validatePassword("password"),
  validateConfirmPassword("confirmPassword"),
];
