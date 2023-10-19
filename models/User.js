import { Schema, model as Model, SchemaTypes } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "affiliator"],
      default: "user",
    },

    gender: {
      type: String,
      enum: ["male", "female", "not specified"],
      required: false,
    },
    phoneNumber: {
      type: String,
      require: false,
    },

    fullAddress: {
      type: String,
      require: false,
    },
    birthDate: {
      type: Date,
      require: false,
    },
    verificationCode: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
    newEmail: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    //affiliate
    promoCode: [
      {
        type: SchemaTypes.ObjectId,
        ref: "PromoCode",
      },
    ],
  },

  { timestamps: true }
);

userSchema.pre("remove", async function (next) {

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = Model("User", userSchema);
export default User;
