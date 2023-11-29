import { Schema, model as Model } from "mongoose";

const promoCodeSchema = new Schema(
  {
    promoCode: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PromoCode = Model("PromoCode", promoCodeSchema);
export default PromoCode;
