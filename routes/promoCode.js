import express from "express";
import {
  createPromoCode,
  getPromoCodes,
  getPromoCode,
  updatePromoCode,
  deletePromoCode,
} from "../controllers/promoCode.js";

import { protect, permission } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, permission("admin"), createPromoCode)
  .get(protect, permission("admin"), getPromoCodes);

router
  .route("/:id")
  .get(protect, permission("admin"), getPromoCode)
  .put(protect, permission("admin"), updatePromoCode)
  .delete(protect, permission("admin"), deletePromoCode);

export default router;
