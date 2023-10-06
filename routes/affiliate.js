import express from "express";
import {
  getUsers,
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

// router.use(protect);
// router.use();

router
  .route("/")
  .get(protect, permission(["admin"]), getUsers)
  .post(
    // protect,
    // permission(["admin"]),
    createUserValidationRules(),
    // validate,
    createUser
  );

router
  .route("/:id")
  .get(protect, getUserValidationRules(), validate, getUser)
  .put(protect, updateUserValidationRules(), validate, updateUser)
  .delete(protect, deleteUserValidationRules(), validate, deleteUser);

export default router;
