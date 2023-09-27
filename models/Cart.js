import { Schema, model as Model } from "mongoose";

const CartSchema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      size: String,
      color: String,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default Model("Cart", CartSchema);
