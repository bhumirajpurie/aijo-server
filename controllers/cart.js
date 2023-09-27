import Cart from "../models/Cart.js";
// import User from "../models/User.js";
import Product from "../models/Product.js";
import catchAsync from "../utils/catchAsync.js";
import createError from "../utils/createError.js";

export const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const userId = req.user._id;

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

  // Find the user's cart or create a new one if it doesn't exist
  const userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    const newCart = await Cart.create({
      products: [
        { product: productId, quantity: quantity, size: size, color: color },
      ],
      user: userId,
    });
    return res.status(201).send({ status: "success", cart: newCart });
  }

  // Check if the product already exists in the cart, and update the quantity accordingly
  const existingProduct = userCart.products.find(
    (p) => p.product.toString() === productId
  );
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    userCart.products.push({
      product: productId,
      quantity,
      size,
      color,
    });
  }

  await userCart.save();
  res.status(201).send({ status: "success", cart: userCart });
});

export const getCarts = catchAsync(async (req, res) => {
  const carts = await Cart.find();
  if (!carts) throw createError(404, `No carts found`);
  res.status(200).send({ status: "success", carts: carts });
});

export const getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "products.product",
    model: "Product",
  });
  if (!cart) throw createError(404, `Your cart is empty`);

  // Extract the first image URL from each product's images array
  const productsWithFirstImage = cart.products.map((productDetails) => {
    const image =
      productDetails.product.images.length > 0
        ? productDetails.product.images[0]
        : null;
    return {
      id: productDetails.product._id,
      name: productDetails.product.name,
      brand: productDetails.product.brand,
      description: productDetails.product.description,
      price: productDetails.product.price,
      discount: productDetails.product.discount,
      image: image, // Include the first image URL
      size: productDetails.size,
      color: productDetails.color,
      selectedQuantity: productDetails.quantity,
    };
  });

  res.status(200).send({
    status: "success",
    cart: productsWithFirstImage,
    id: cart._id,
  });
});

export const updateCartItem = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

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

  const userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    throw createError(404, `Cart not found for user with id of ${userId}`);
  }

  // Check if the product already exists in the cart, and update the quantity accordingly
  const existingProduct = userCart.products.find(
    (p) => p.product.toString() === productId
  );

  if (!existingProduct) {
    throw createError(404, `Product with id ${productId} not found in cart`);
  }

  existingProduct.quantity = quantity;

  await userCart.save();
  res.status(200).send({ status: "success", cart: userCart });
});

export const deleteCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOneAndRemove({ user: req.user._id });
  if (!cart)
    throw createError(
      404,
      `Can not find the cart of user with id ${req.user._id}`
    );
  res
    .status(204)
    .send({ status: "success", message: "Cart Deleted Successfully" });
});

export const deleteCartItem = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    throw createError(
      404,
      `Can not find the cart of user with id ${req.user._id}`
    );
  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === req.params.id
  );
  if (productIndex === -1)
    throw createError(
      404,
      `Can not find the product with id ${req.params.id} in the cart`
    );
  cart.products.splice(productIndex, 1);
  const updatedCart = await cart.save();

  res.status(204).send({ status: "success", cart: updatedCart });
});
