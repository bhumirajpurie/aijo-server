import express from "express";
const router = express.Router();

import { validateCreateAddressBook } from "../validators/address-book.validator.js";
import {
  createAddressBook,
  getAddressBook,
  deleteAddressBook,
  updateAddressBook,
  getSingleAddressBook
} from "../controllers/address-book.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

router
  .route("/")
  .post(protect, validateCreateAddressBook, validate, createAddressBook)
  .get(protect, getAddressBook);

router
  .route("/:id")
  .get(protect, getSingleAddressBook)
  .delete(protect, deleteAddressBook)
  .put(protect, updateAddressBook);
export default router;
