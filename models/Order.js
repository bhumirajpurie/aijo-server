import { Schema, model as Model, model } from "mongoose";

const OrderSchema = new Schema({
  shippingInfo: {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    landMark: {
      type: String,
    },
    province: {
      type: String,
      enum: [
        "Bagmati",
        "Gandaki",
        "Karnali",
        "Koshi",
        "Lumbini",
        "Madhesh",
        "Sudurpaschim",
      ],
    },
    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderItems: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      purchasePrice: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      priceWithTax: {
        type: Number,
        default: 0,
      },
      totalTax: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        default: "Not_processed",
        enum: [
          "Not_processed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
      },
    },
  ],
});

const Order = Model("Order", OrderSchema);
export default Order;
