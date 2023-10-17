import express from "express";
import {
  addToCart,
  getCarts,
  getCart,
  updateCartItem,
  deleteCart,
  deleteCartItem,
  getMyCarts,
  deleteCarts,
} from "../controllers/cart.js";

import { protect, permission } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, addToCart)
  .get(protect, getCart)
  .put(protect, updateCartItem)
  .delete(protect, deleteCart);

router.route("/all-cart").get(protect, permission(["admin"]), getCarts);
router.route("/my").get(protect, getMyCarts);
router.route("/delete-my").get(protect, deleteCarts);

router.route("/products/:id").delete(protect, deleteCartItem);

export default router;
