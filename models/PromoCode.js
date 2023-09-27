import { Schema, model as Model } from "mongoose";

const promoCodeSchema = new Schema({
  promoCode: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, default: true },
});

const PromoCode = Model("PromoCode", promoCodeSchema);
export default PromoCode;
