import Order from "../models/Order.js";
import Product from "../models/Product.js";
import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";
import Payment from "../models/paymentMethod.js";

export const addToOrder = catchAsync(async (req, res) => {
  const { shippingInfo, orderItems, totalBillAmount, paymentDetails } =
    req.body;
  const userId = req.user;
  const paymentImage = req.file ? req.file.path : null;
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
    product.quantity -= quantity;
    await product.save();
  }
  const payment = await Payment.create({
    ...paymentDetails,
    image: paymentImage,
  });
  if (!payment) throw createError(404, `Payment method is fail to create`);
  // Create order
  await Order.create({
    shippingInfo: shippingInfo,
    orderItems: orderItems,
    user: userId,
    totalBillAmount,
    paymentMethod: payment._id,
  });
  res
    .status(201)
    .send({ status: "success", message: "order created successfully" });
});

export const getOrders = catchAsync(async (_, res) => {
  const orders = await Order.find().populate("paymentMethod").populate({
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
  res.status(200).send({ status: "success", order });
});

export const getOrderDetails = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: "orderItems.product",
    })
    .populate("paymentMethod");
  if (!order)
    throw createError(404, `Order is not found with id of ${req.params.id}`);
  res.status(200).send({ status: "success", order: order });
});

// get recent orders -> 3 orders
export const getRecentOrders = catchAsync(async (_, res) => {
  const orders = await Order.find().sort("-createdAt").limit(3).populate({
    path: "orderItems.product",
    select: "name images",
  });
  if (!orders) throw createError(200, `No orders found`);
  res.status(200).send({ status: "success", orders });
});

// total revenue of last 30 days
export const getTotalRevenue = catchAsync(async (_, res) => {
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
    },
  });
  if (!orders) throw createError(200, `No orders found`);
  let total = 0;
  orders.forEach((order) => {
    total += order.totalBillAmount;
  });
  res.status(200).send({ status: "success", total });
});

// orders of last 30 days
export const getOrdersLast30Days = catchAsync(async (_, res) => {
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
    },
  });
  if (!orders) throw createError(200, `No orders found`);
  res.status(200).send({ status: "success", orders: orders?.length });
});

// get monthly sales -> 12 months
export const getMonthlySales = catchAsync(async (_, res) => {
  const orders = await Order.find({
    createdAt: {
      $gte: new Date(new Date() - 365 * 60 * 60 * 24 * 1000),
    },
  });
  if (!orders) throw createError(200, `No orders found`);
  const monthlySales = [];
  for (let i = 0; i < 12; i++) {
    let total = 0;
    orders.forEach((order) => {
      if (order.createdAt.getMonth() === i) {
        total += order.totalBillAmount;
      }
    });
    monthlySales.push({
      name: convertMonth(i),
      sales: !isNaN(total) ? total.toFixed(0) : 0,
    });
  }
  res.status(200).send({ status: "success", sales: monthlySales });
});

// convert month 1 to january and so on
const convertMonth = (month) => {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString("en-US", { month: "long" });
};

// delete order
export const deleteOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    throw createError(404, `Order is not found with id of ${req.params.id}`);
  // order.orderItems.forEach(async (orderItem) => {
  //   const product = await Product.findById(orderItem._id);
  //   if (!product)
  //     throw createError(
  //       404,
  //       `Product is not found with id of ${orderItem._id}`
  //     );
  //   product.quantity += orderItem.quantity;
  //   await product.save();
  // });
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).send({ status: "success", message: "order deleted" });
});

// update status of products ordered in the order
export const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, orderedProductId, status } = req.body;
  const order = await Order.findById(orderId);
  if (!order)
    throw createError(404, `Order is not found with id of ${req.params.id}`);
  const orderedItem = order.orderItems.find(
    (orderItem) => orderItem._id == orderedProductId
  );
  if (!orderedItem) {
    throw createError(
      404,
      `Ordered item is not found with id of ${orderedProductId}`
    );
  }
  orderedItem.status = status;
  await order.save();
  res.status(200).send({
    status: "success",
    message: "order status updated",
  });
});

// cancel order
export const cancelOrderProduct = catchAsync(async (req, res) => {
  const { orderId, orderedProductId, quantity } = req.body;
  const order = await Order.findById(orderId);
  if (!order)
    throw createError(404, `Order is not found with id of ${req.params.id}`);
  // order.orderItems.forEach(async (orderItem) => {
  //   const product = await Product.findById(orderItem._id);
  //   if (!product)
  //     throw createError(
  //       404,
  //       `Product is not found with id of ${orderItem._id}`
  //     );
  //   product.quantity += orderItem.quantity;
  //   await product.save();
  // });
  const orderedItem = order.orderItems.find(
    (orderItem) => orderItem._id == orderedProductId
  );
  if (!orderedItem) {
    throw createError(
      404,
      `Ordered item is not found with id of ${orderedProductId}`
    );
  }
  const product = await Product.findById(orderedProductId);
  // if (!product)
  //   throw createError(
  //     404,
  //     `Product is not found with id of ${orderedProductId}`
  //   );
  // product.quantity += quantity;
  // await product.save();
  // orderedItem.status = "Cancelled";
  // await order.save();
  res
    .status(200)
    .send({ status: "success", message: "order deleted", product });
});
