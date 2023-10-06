import {
  validateCity,
  validateProvince,
  validateArea,
} from "./rootValidator.js";

export const validateCreateAddressBook = [
  validateCity("city"),
  validateProvince("province"),
  validateArea("area"),
];
