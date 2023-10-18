import express from "express";
import { permission, protect } from "../middlewares/auth.js";
import {
  addToOrder,
  getOrders,
  getOrder,
  getOrderDetails,
  getRecentOrders,
  getTotalRevenue,
} from "../controllers/order.js";

const router = express.Router();

router.route("/").post(protect, addToOrder);
router.route("/all").get(protect, permission(["admin"]), getOrders);
router.route("/recent").get(protect, permission(["admin"]), getRecentOrders);
router.route("/revenue").get(protect, permission(["admin"]), getTotalRevenue);
router.route("/my-orders").get(protect, getOrder);
router.route("/:id").get(protect, getOrderDetails);

export default router;
