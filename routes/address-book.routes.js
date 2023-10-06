import express from "express";
const router = express.Router();

import { validateCreateAddressBook } from "../validators/address-book.validator.js";
import { createAddressBook } from "../controllers/address-book.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

router
  .route("/")
  .post(protect, validateCreateAddressBook, validate, createAddressBook);

export default router;
