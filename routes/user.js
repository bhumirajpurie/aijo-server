import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  verifyUser,
} from "../controllers/user.js";
import { protect, permission } from "../middlewares/auth.js";
import {
  createUserValidationRules,
  deleteUserValidationRules,
  updateUserAddressValidationRules,
  updateUserValidationRules,
} from "../validators/userValidator.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

// router.use(protect);
// router.use();

router
  .route("/")
  .get(protect, getUsers)
  .post(
    protect,
    permission(["admin"]),
    createUserValidationRules(),
    validate,
    createUser
  );

router.route("/my-details").get(protect, validate, getUser);
router.route("/all").get(protect, validate, getAllUsers);
router.route("/verify/:id").patch(verifyUser);
router
  .route("/profile")
  .put(protect, updateUserAddressValidationRules(), validate, updateUser);

router
  .route("/:id")
  .put(protect, updateUserValidationRules(), validate, updateUser)
  .delete(protect, deleteUserValidationRules(), validate, deleteUser);
export default router;
