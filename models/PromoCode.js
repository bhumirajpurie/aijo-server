import { Schema, model as Model } from "mongoose";

const promoCodeSchema = new Schema(
  {
    promoCode: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

const PromoCode = Model("PromoCode", promoCodeSchema);
export default PromoCode;
