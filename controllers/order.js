import Order from "../models/Order.js";
// import User from "../models/User.js";
import Product from "../models/Product.js";
import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";

export const addToOrder = catchAsync(async (req, res) => {
  const { shippingInfo, orderItems } = req.body;
  const userId = req.user;

  // Loop through all the order items and check the product quantity
  for (const orderItem of orderItems) {
    const productId = orderItem.product;
    const quantity = orderItem.quantity;

    const product = await Product.findById(productId);

    if (!product) {
      throw createError(404, `Product is not found with id of ${productId}`);
    }

    if (product.quantity < 1) {
      throw createError(404, `Product is out of stock`);
    }

    if (product.quantity < quantity) {
      throw createError(404, `Not enough quantity available`);
    }
  }

  // Create order
  await Order.create({
    shippingInfo,
    orderItems,
    user: userId,
  });

  res
    .status(201)
    .send({ status: "success", message: "order created successfully" });
});

export const getOrders = catchAsync(async (req, res) => {
  const orders = await Order.find().populate({
    path: "orderItems.product",
    select: "name images",
  });
  if (!orders) throw createError(404, `No orders found`);
  res.status(200).send({ status: "success", orders: orders });
});

export const getOrder = catchAsync(async (req, res) => {
  const order = await Order.find({ user: req.user }).populate({
    path: "orderItems.product",
    select: "name images",
  });
  if (!order) throw createError(404, `Order is empty`);
  res.status(200).send({ status: "success", order: order });
});

export const getOrderDetails = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: "orderItems.product",
  });
  if (!order)
    throw createError(404, `Order is not found with id of ${req.params.id}`);
  res.status(200).send({ status: "success", order: order });
});
