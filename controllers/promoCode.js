import catchAsync from "../utils/catchAsync.js";
import PromoCode from "../models/PromoCode.js";
import createError from "../utils/createError.js";
import User from "../models/User.js";

export const createPromoCode = catchAsync(async (req, res) => {
  const user = await User.findById(req.user);
  if (!user) {
    throw createError(404, "User not found");
  }
  if (!user.promoCode) {
    user.promoCode = [];
  }
  const promoCode = await PromoCode.create({ ...req.body, user: req.user });
  user.promoCode.push(promoCode._id);
  await user.save();
  res.status(201).send({
    status: "success",
    message: "Promo code created successfully",
  });
});

export const getPromoCodes = catchAsync(async (req, res) => {
  const promoCodes = await PromoCode.find();
  res.status(200).send({ status: "success", promoCodes });
});

export const getPromoCode = catchAsync(async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);
  if (!promoCode) {
    return createError("Promo code not found.", 404);
  }
  res.status(200).send({ status: "success", promoCode });
});

export const updatePromoCode = catchAsync(async (req, res) => {
  const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!promoCode) {
    return createError("Promo code not found.", 404);
  }
  res.status(200).send({ status: "success", promoCode });
});

export const deletePromoCode = catchAsync(async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);
  if (!promoCode) {
    return createError(`Promo code not found with id of ${req.params.id}`, 404);
  }
  await PromoCode.findByIdAndRemove(req.params.id);
  res
    .status(200)
    .send({ status: "success", message: "Promo code deleted successfully" });
});

export const getMyPromoCodes = catchAsync(async (req, res) => {
  try {
    const codes = await PromoCode.find({ user: req.user });
    if (!codes) return createError("No promo codes found.", 404);

    res.status(200).send({ status: "success", codes });
  } catch (error) {}
});
