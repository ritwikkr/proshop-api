import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: [
      {
        name: { type: String },
        phoneNumber: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        postal: { type: String },
        country: { type: String },
      },
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId }],
    googleId: { type: String, unique: true },
    isVerified: { type: Boolean, default: false, required: true },
    otp: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  return (this.password = await bcrypt.hash(this.password, salt));
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) {
    return "User not registered";
  }
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.createJWT = function () {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

export default mongoose.model("User", userSchema);
