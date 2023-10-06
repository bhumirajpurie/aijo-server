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
  validateMongoId("id"),
  // validate address fields
  validateName(["province", "city", "area"]),
  // validate fullAddress
  validateName(["fullAddress"]),
];
export const deleteUserValidationRules = () => validateMongoId("id");
