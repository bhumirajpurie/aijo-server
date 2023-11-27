import express from "express";
import {
  createPromoCode,
  getPromoCodes,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
  getMyPromoCodes,
  activatePromoCode,
} from "../controllers/promoCode.js";

import { protect, permission } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createPromoCodeValidationRules } from "../validators/promoCodeValidator.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createPromoCodeValidationRules(), validate, createPromoCode)
  .get(
    // protect,
    // permission(["admin"]),
    getPromoCodes
  );
router.route("/my-promo-code").get(protect, validate, getMyPromoCodes);
router.route("/active/:id").get(protect, validate, activatePromoCode);
router
  .route("/:id")
  .get(protect, permission(["admin"]), getPromoCode)
  .put(protect, permission(["admin"]), updatePromoCode)
  .delete(protect, deletePromoCode);

export default router;
