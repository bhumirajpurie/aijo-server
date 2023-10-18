import express from "express";

import { protect, permission } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

import {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethod.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllPaymentMethods)
  .post(
    protect,
    permission(["admin"]),
    upload.single("paymentMethodImage"),
    createPaymentMethod
  );

router
  .route("/:id")
  .get(protect, permission(["admin"]), getPaymentMethodById)
  .put(
    protect,
    permission(["admin"]),
    upload.single("paymentMethodImage"),
    updatePaymentMethod
  )
  .delete(protect, permission(["admin"]), deletePaymentMethod);

export default router;
