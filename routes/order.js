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
  deleteOrder,
  updateOrderStatus,
  cancelOrderProduct,
} from "../controllers/order.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.route("/all").get(protect, permission(["admin"]), getOrders);
router.route("/recent").get(protect, permission(["admin"]), getRecentOrders);
router.route("/sales").get(protect, permission(["admin"]), getMonthlySales);
router
  .route("/product-status")
  .patch(protect, permission(["admin"]), updateOrderStatus);
router
  .route("/cancel-product")
  .patch(protect, permission(["admin"]), cancelOrderProduct);
router
  .route("/recent-30")
  .get(protect, permission(["admin"]), getOrdersLast30Days);
router.route("/revenue").get(protect, permission(["admin"]), getTotalRevenue);

router.route("/").post(upload.single("paymentDetails[image]"), addToOrder);
router.route("/my-orders").get(protect, getOrder);
router.route("/:id").get(getOrderDetails);
router.route("/:id").delete(protect, permission(["admin"]), deleteOrder);
export default router;
