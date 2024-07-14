import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required!"],
      maxLength: [50, "Name should be less than 50 characters"],
      minLength: [3, "Name should be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email id!",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false,
      minLength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  generateJWTToken: function () {
    return jwt.sign(
      { id: this._id, email: this.email , role:this.role},
      process.env.JWT_SECRET,
      {
        expiresIn: "20h",
      }
    );
  },

  generatePasswordResetToken: function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.forgetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");    // this is to store db with security
    this.forgetPasswordExpiry = Date.now() + 15*60*1000;    // 15 minutes from now

    return resetToken;
  },

  comparePassword: async function (plaintextPassword) {
    return await bcrypt.compare(plaintextPassword, this.password);
  },
};

const User = model("User", userSchema);
export default User;
