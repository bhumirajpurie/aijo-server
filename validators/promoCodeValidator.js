import {
  validateMongoId,
  validatePromoCode,
  validatePercentage,
  validateDate,
  validateDescription,
} from "./rootValidator.js";

export const createPromoCodeValidationRules = () => [
  validateMongoId("affiliateId"),
  validatePromoCode("promoCode"),
  validatePercentage("discountPercentage"),
  validateDescription("description"),
  validateDate("expiresAt"),
];
