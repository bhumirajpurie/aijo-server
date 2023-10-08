import express from "express";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.js";

import { getAffiliates, createAffiliate } from "../controllers/affiliate.js";

import {
  createUserValidationRules,
  deleteUserValidationRules,
  getUserValidationRules,
  updateUserValidationRules,
} from "../validators/userValidator.js";

import { protect, permission } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAffiliates)
  .post(
    protect,
    permission(["admin"]),
    // createUserValidationRules(),
    validate,
    createAffiliate
  );

router
  .route("/:id")
  .get(protect, getUserValidationRules(), validate, getUser)
  .put(protect, updateUserValidationRules(), validate, updateUser)
  .delete(protect, deleteUserValidationRules(), validate, deleteUser);

export default router;
