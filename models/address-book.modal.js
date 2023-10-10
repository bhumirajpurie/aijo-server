import { Schema, model } from "mongoose";

const addressBookSchema = new Schema(
  {
    province_id:{
      type: Number,
      required: false
    },
    province: {
      type: String,
      required: false,
      lowercase: true,
    },
    city: {
      type: String,
      required: false,
      lowercase: true,
    },
    area: {
      type: String,
      required: false,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullAddress: {
      type: String,
      require: false,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default model("AddressBook", addressBookSchema);
