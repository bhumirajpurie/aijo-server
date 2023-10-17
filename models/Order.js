import { Schema, model as Model, model } from "mongoose";

const OrderSchema = new Schema(
  {
    shippingInfo: {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: false,
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
    promoCode: {
      type: Schema.Types.ObjectId,
      ref: "PromoCode",
      required: false,
    },
    totalBillAmount: {
      type: Number,
      default: 0,
      required: true,
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
        size: {
          type: String,
          require: true,
        },
        color: {
          type: String,
          require: true,
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
  },
  {
    timestamps: true,
  }
);

const Order = Model("Order", OrderSchema);
export default Order;
