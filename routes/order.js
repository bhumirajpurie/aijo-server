import express from "express";
import { protect } from "../middlewares/auth.js";
import { addToOrder, getOrders, getOrder } from "../controllers/order.js";

const router = express.Router();

router.route("/").get(protect, getOrder).post(protect, addToOrder);
router.route("/all-orders").get(protect, getOrders);

export default router;
