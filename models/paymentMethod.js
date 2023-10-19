import { Schema, model as Model } from "mongoose";

const paymentMethodSchema = new Schema({
  method: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: function () {
      return this.method !== "COD";
    },
  },

  accountNumber: {
    type: String,
    required: function () {
      return this.method !== "COD";
    },
  },

  accountName: {
    type: String,
    required: function () {
      return this.method !== "COD";
    },
  },

  description: {
    type: String,
  },
});

const Payment = Model("PaymentMethod", paymentMethodSchema);

export default Payment;
