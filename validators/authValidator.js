import {
  validateName,
  validateConfirmationCode,
  validateUserRole,
  validateEmail,
  validateUniqueEmail,
  validatePassword,
  validateConfirmPassword,
  validateToken,
} from "./rootValidator.js";

export const signupValidationRules = () => [
  validateName(["firstName", "lastName"]),
  validateUniqueEmail("email"),
  validatePassword("password"),
  validateConfirmPassword("confirmPassword"),
  validateUserRole("role"),
];

export const codeValidationRules = () =>
  validateConfirmationCode("verificationCode");

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
