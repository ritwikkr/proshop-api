import bcrypt from "bcryptjs";

import User from "../model/userSchema.js";
import sendPasswordResetEmail from "../middleware/sendMail.js";
import asyncHandler from "../middleware/asyncHandler.js";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404);
    throw new Error("Please provide all details!");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not registered!. Please register first");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(404);
    throw new Error("Email or Password incorrect");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(200).json({ user, token });
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password) {
    res.status(404);
    throw new Error("Please provide all details!");
  }
  if (password !== confirmPassword) {
    res.status(404);
    throw new Error("Passwords do not match");
  }
  const isEmailPresent = await User.findOne({ email });
  if (isEmailPresent) {
    res.status(404);
    throw new Error("You are already registered. Please log in");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  user.password = undefined;
  res.status(201).json({ user, token });
});

const addAddress = asyncHandler(async (req, res) => {
  const { userAddress, userId } = req.body;
  const isUserPresent = await User.findById(userId);
  if (!isUserPresent) {
    res.status(404);
    throw new Error("Email not present");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        address: {
          name: userAddress.name,
          phoneNumber: userAddress.phoneNumber,
          address: userAddress.address,
          city: userAddress.city,
          state: userAddress.state,
          postal: userAddress.postal_code,
          country: userAddress.country,
        },
      },
    },
    { new: true }
  );
  const token = user.createJWT();
  return res.status(200).json({ user, token });
});

const updateUser = asyncHandler(async (req, res) => {
  let { name, email, password, id } = req.body;
  const data = await User.findById(id);
  if (!data) {
    res.status(404);
    throw new Error("Email not present");
  }
  const bodyToUpdate = { name, email };
  const user = await User.findByIdAndUpdate(id, bodyToUpdate, {
    new: true,
  });
  const token = user.createJWT();
  return res.status(200).json({ user, token });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { passwordDetails, id } = req.body;
  const isUserPresent = await User.findById(id);
  const isPasswordCorrect = await isUserPresent.comparePassword(
    passwordDetails.currPassword
  );
  if (!isPasswordCorrect) {
    res.status(404);
    throw new Error("Old Password Incorrect");
  }
  const salt = await bcrypt.genSalt(10);
  passwordDetails.newPassword = await bcrypt.hash(
    passwordDetails.newPassword,
    salt
  );
  const user = await User.findByIdAndUpdate(
    id,
    {
      password: passwordDetails.newPassword,
    },
    { new: true }
  );
  user.password = undefined;
  const token = await user.createJWT();
  return res.status(200).json({ user, token });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { user } = req.body;
  const isUserPresent = await User.findOne({ email: user });
  if (!isUserPresent) {
    res.status(404);
    throw new Error("Email Not Present");
  }
  const token = await isUserPresent.createJWT();

  const resetLink = `https://myproshop.netlify.app/reset-password?token=${token}`;
  // const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const emailSent = await sendPasswordResetEmail(
    isUserPresent.email,
    resetLink
  );
  if (!emailSent) {
    res.status(404);
    throw new Error("Error");
  }
  res.status(200).json("Email Sent Successfully");
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { userId, addressId } = req.query;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not present");
  }

  // Find the index of the address in the user's address array
  const addressIndex = user.address.findIndex(
    (address) => address._id.toString() === addressId
  );

  if (addressIndex === -1) {
    return res.status(400).json("Address not found");
  }

  // Remove the address from the address array
  user.address.splice(addressIndex, 1);

  // Save the updated user
  await user.save();

  return res.status(200).json(user);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user);
  if (!user) {
    res.status(404);
    throw new Error("User not present");
  }

  // Update the password
  user.password = newPassword;
  await user.save();

  res.status(200).json("Password reset successfully");
});

const checkJWTExpiry = asyncHandler(async (req, res) => {
  res.status(200).json(true);
});

export {
  login,
  signup,
  addAddress,
  updateUser,
  updatePassword,
  forgotPassword,
  deleteAddress,
  resetPassword,
  checkJWTExpiry,
};
