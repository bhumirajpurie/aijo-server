import catchAsync from "../utils/catchAsync.js";
import PromoCode from "../models/PromoCode.js";
import createError from "../utils/createError.js";

export const createPromoCode = catchAsync(async (req, res) => {
  const promoCode = await PromoCode.create(req.body);
  res.status(200).send({ status: "success", promoCode });
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
    .status(204)
    .send({ status: "success", message: "Promo code deleted successfully" });
});
