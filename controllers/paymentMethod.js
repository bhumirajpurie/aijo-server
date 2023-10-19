import PaymentMethod from "../models/paymentMethod.js";
import catchAsync from "../utils/catchAsync.js";
import clearImage from "../utils/clearImage.js";
import createError from "../utils/createError.js";

// Create a new payment method
export const createPaymentMethod = catchAsync(async (req, res) => {
  if (req.file) req.body.image = req.file.path;
  const paymentMethod = await PaymentMethod.create(req.body);
  res.status(201).send({ status: "success", paymentMethod });
});

// Get all payment methods
export const getAllPaymentMethods = catchAsync(async (req, res) => {
  const paymentMethods = await PaymentMethod.find();
  res.status(200).send({ status: "success", paymentMethods });
});

// Get a payment method by ID
export const getPaymentMethodById = catchAsync(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);
  if (!paymentMethod) {
    throw createError(404, "Payment Method not found");
  }
  res.status(200).send({ status: "success", paymentMethod });
});

// Update a payment method
export const updatePaymentMethod = catchAsync(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);
  if (!paymentMethod) throw createError("Payment Method not found.", 404);

  if (req.file) {
    req.body.image = req.file.path;
    clearImage(paymentMethod.image);
  }

  const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).send({ status: "success", updatedPaymentMethod });
});

// Delete a payment method
export const deletePaymentMethod = catchAsync(async (req, res) => {
  const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);

  if (!paymentMethod) {
    throw createError(404, "Payment Method not found");
  }

  clearImage(paymentMethod.image);

  res.status(200).send({
    status: "success",
    message: "Payment method deleted successfully.",
  });
});

// Verify a paymentMethod
// export const verifyPaymentMethod = catchAsync(async (req, res) => {
//   const paymentMethod = await PaymentMethod.findByIdAndUpdate(
//     req.params.id,
//     { verified: true },
//     { new: true }
//   );
//   if (!paymentMethod) {
//     throw createError(404, "PaymentMethod not found");
//   }
//   res.status(200).json({ status: "success", paymentMethod });
// });
