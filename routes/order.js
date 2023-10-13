import express from "express";
import { protect } from "../middlewares/auth.js";
import { addToOrder, getOrders, getOrder } from "../controllers/order.js";

const router = express.Router();

router.route("/").post(protect, addToOrder);
router.route("/all-orders").get(protect, getOrders);
router.route("/my-orders").get(protect, getOrder);

export default router;
