import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "../controllers/product.js";

import upload from "../middlewares/multer.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(upload.array("productImage", 5), createProduct);

router.get("/all", getAllProducts);
router.route("/featured").get(getFeaturedProducts);

router
  .route("/:id")
  .get(getProduct)
  .put(upload.array("productImage", 5), updateProduct)
  .delete(deleteProduct);

export default router;
