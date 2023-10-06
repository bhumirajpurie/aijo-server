import { body, check, param } from "express-validator";
import User from "../models/User.js";
import PromoCode from "../models/PromoCode.js";

// validate name
export const validateName = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Firstname and Lastname are required.")
    .isLength({ min: 2 })
    .withMessage("Firstname and Lastname should be greater than two character.")
    .trim()
    .escape();
};
// validate phoneNumber
export const validatePhoneNumber = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits")
    .trim()
    .escape();
};

// validate birthDate
export const validateBirthDate = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Birth date is required")
    .isDate()
    .withMessage("Birth date must be a valid date")
    .toDate()
    .trim()
    .escape();
};

export const validateConfirmationCode = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Verfication code is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Verification code must be exactly 6 characters long.")
    .toUpperCase()
    .trim()
    .escape();
};

export const validateUserRole = (fields) => {
  return body(fields).custom((value) => {
    if (value === "admin") {
      throw new Error("You can't create admin user.");
    }
    if (!["admin", "user", "affiliator"].includes(value)) {
      throw new Error(`${value} role doesn't exit.`);
    }
    return true;
  });
};

export const validateEmail = (fields) => {
  return body(fields)
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail()
    .trim()
    .escape();
};

export const validateUniqueEmail = (fields) => {
  return body(fields)
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value, { req }) => {
      const userRole = req.body?.role || "user";
      const user = await User.findOne({ email: value, role: userRole });
      if (user) {
        return Promise.reject("Email address already exists.");
      }
    })
    .normalizeEmail()
    .trim()
    .escape();
};

export const validatePassword = (fields) => {
  return body(fields)
    .isLength({ min: 5, max: 25 })
    .withMessage("Password must be alteast 5 characters long.")
    .matches("[0-9]")
    .withMessage("Password must contain a number.")
    .matches("[A-Z]")
    .withMessage("Password must contain an uppercase letter.")
    .trim();
};

export const validateConfirmPassword = (fields) => {
  return body(fields).custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Please enter a matching password.");
    }
    return true;
  });
};

export const validateToken = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Token is required.")
    .isLength({ min: 40, max: 40 })
    .withMessage("Token must be exactly 40 characters long.")
    .trim()
    .escape();
};

export const validateMongoId = (params) => {
  return check(params)
    .notEmpty()
    .withMessage("Id is required.")
    .isMongoId()
    .withMessage("Invalid Id.")
    .trim()
    .escape();
};

export const validatePercentage = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Discount percentage is required.")
    .isNumeric()
    .withMessage("Discount percentage must be a number.")
    .isFloat({ min: 0 })
    .withMessage("Discount percentage must be positive")
    .isLength({ min: 0, max: 100 })
    .withMessage("Discount percentage must be between 0 and 100.")
    .trim()
    .escape();
};

export const validateDate = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Date is required.")
    .isISO8601()
    .withMessage("Invalid date.")
    .trim()
    .escape();
};

export const validatePromoCode = (fields) => {
  return body(fields)
    .isLength({ min: 6, max: 6 })
    .withMessage("Promo code must be exactly 6 characters long.")
    .toUpperCase()
    .custom(async (value, { req }) => {
      const promoCode = await PromoCode.findOne({ promoCode: value });
      if (promoCode) {
        return Promise.reject("Promo code alredy exists.");
      }
    })
    .trim()
    .escape();
};

export const validateDescription = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be atleast 10 characters long.")
    .trim()
    .escape();
};

// validate city
export const validateCity = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("City is required.")
    .isLength({ min: 5, max: 50 })
    .withMessage("City must be at least 2 characters long.")
    .trim()
    .escape();
};

// validate province
export const validateProvince = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Province is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Province must be at least 2 characters long.")
    .trim()
    .escape();
};

// validate area
export const validateArea = (fields) => {
  return body(fields)
    .notEmpty()
    .withMessage("Area is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Area must be at least 2 characters long.")
    .trim()
    .escape();
};
