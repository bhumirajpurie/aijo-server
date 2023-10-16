import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addToOrder,
  getOrders,
  getOrder,
  getOrderDetails,
} from "../controllers/order.js";

const router = express.Router();

router.route("/").post(protect, addToOrder);
router.route("/all").get(protect, getOrders);
router.route("/my-orders").get(protect, getOrder);
router.route("/:id").get(protect, getOrderDetails);

export default router;
