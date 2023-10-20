import express from "express";
import { permission, protect } from "../middlewares/auth.js";
import {
  addToOrder,
  getOrders,
  getOrder,
  getOrderDetails,
  getRecentOrders,
  getTotalRevenue,
  getOrdersLast30Days,
  getMonthlySales,
} from "../controllers/order.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router
  .route("/")
  .post(protect, upload.single("paymentDetails[image]"), addToOrder);
router.route("/all").get(protect, permission(["admin"]), getOrders);
router.route("/recent").get(protect, permission(["admin"]), getRecentOrders);
router.route("/sales").get(protect, permission(["admin"]), getMonthlySales);
router
  .route("/recent-30")
  .get(protect, permission(["admin"]), getOrdersLast30Days);
router.route("/revenue").get(protect, permission(["admin"]), getTotalRevenue);
router.route("/my-orders").get(protect, getOrder);
router.route("/:id").get(protect, getOrderDetails);

export default router;
