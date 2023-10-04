import {
  validateName,
  validatePassword,
  validateUserRole,
  validateUniqueEmail,
  validateMongoId,
} from "./rootValidator.js";

export const createUserValidationRules = () => [
  validateUserRole("role"),
  validateName(["firstName", "lastName"]),
  validateUniqueEmail("email"),
  validatePassword("password"),
];

export const getUserValidationRules = () => validateMongoId("id");

export const updateUserValidationRules = () => [
  validateMongoId("id"),
  validateName(["firstName", "lastName"]),
  validateUniqueEmail("email"),
  validatePassword("password"),
];

export const deleteUserValidationRules = () => validateMongoId("id");
