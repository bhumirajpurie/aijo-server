import {
  validateMongoId,
  validatePromoCode,
  validatePercentage,
  validateDate,
  validateDescription,
} from "./rootValidator.js";

export const createPromoCodeValidationRules = () => [
  validatePromoCode("promoCode"),
  validatePercentage("discountPercentage"),
  validateDate("expiresAt"),
];
