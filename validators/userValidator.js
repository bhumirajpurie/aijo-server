import {
  validateName,
  validatePassword,
  validateUserRole,
  validateUniqueEmail,
  validateMongoId,
  validatePhoneNumber,
  validateBirthDate,
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
  validatePhoneNumber("phoneNumber"),
  validateBirthDate("birthDate"),
];

// update address validation rules
export const updateUserAddressValidationRules = () => [
  validateName(["firstName", "lastName"]),
  validatePhoneNumber("phoneNumber"),
  validateBirthDate("birthDate"),
];
export const deleteUserValidationRules = () => validateMongoId("id");
