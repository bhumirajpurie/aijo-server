import { Schema, model } from "mongoose";

const addressBookSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

export default model("AddressBook", addressBookSchema);
