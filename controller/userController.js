import bcrypt from "bcryptjs";

import User from "../model/userSchema.js";
import Product from "../model/productSchema.js";
import asyncHandler from "../middleware/asyncHandler.js";
import sendEmail from "../middleware/sendEmailViaNodeMailer.js";
import generateOTP from "../helper/otpGeneration.js";

// RES -> {success: true/false, message: "sample message", data: optional(if available)}

async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide all details!" });
    }

    if (password !== confirmPassword) {
      return res
        .status(404)
        .json({ success: false, message: "Passwords do not match" });
    }

    const isEmailPresent = await User.findOne({ email });
    if (isEmailPresent) {
      if (isEmailPresent.googleId) {
        return res.status(404).json({
          success: false,
          message: "You have already registered. Login via Google",
        });
      }
      if (!isEmailPresent.isVerified) {
        return res.status(404).json({
          success: false,
          message: "Go to your email and click on the link for verification",
        });
      }

      return res.status(404).json({
        success: false,
        message: "You are already registered. Please log in",
      });
    }

    // Generate OTP
    const otp = generateOTP(6);
    await User.create({ name, email, password, otp });

    // Send otp in email
    const emailSubject = "Email Verification";
    const emailText = `Hi ${name},

Welcome to ProShop!

Please use the following OTP to verify your email address:

OTP: ${otp}

If you did not sign up for this account, please ignore this email or contact support.

Thank you,
The ProShop Team`;
    const emailHtml = `<p>Hi ${name},</p>
<p>Welcome to ProShop!</p>
<p>Please use the following OTP to verify your email address:</p>
<h2>${otp}</h2>
<p>If you did not sign up for this account, please ignore this email or contact support.</p>
<p>Thank you,<br>The ProShop Team</p>`;

    const emailSent = await sendEmail(
      email,
      emailSubject,
      emailText,
      emailHtml
    );
    if (!emailSent) {
      return res.status(404).json({
        success: false,
        message: "Email didn't sent. Something went wrong",
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Please verify OTP sent to your email" });
  } catch (error) {
    return res.status(404).json({ success: false, message: error });
  }
}

async function verifyOTP(req, res) {
  try {
    const { otp, email } = req.body;
    if (!otp || !email)
      return res
        .status(404)
        .json({ sucess: false, message: "Please provide all values" });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not present" });
    }

    if (user.otp !== otp) {
      return res
        .status(404)
        .json({ success: false, message: "OTP is invalid" });
    }
    const token = user.createJWT();
    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User registeration successfull. Redirecting to homepage",
      data: { token, user },
    });
  } catch (error) {
    return res.status(404).json({ success: false, message: error });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(404)
        .json({ success: false, message: "Please provide all details!" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not registered!. Please register first",
      });

    const isPasswordCorrect = await user.comparePassword(password);

    if (isPasswordCorrect === "User not registered") {
      throw new Error("User not registerd. Sign in via google");
    }
    if (!isPasswordCorrect) {
      res.status(404);
      throw new Error("Email or Password incorrect");
    }
    const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(404).json({ success: false, message: error });
  }
}

const loginViaGoogle = asyncHandler(async (req, res) => {
  // Extract user information from the req.user object
  const user = req.user;
  const token = user.createJWT();
  const { id: googleId, name, email } = user;

  // Redirect to the client with user information as query parameters
  const redirectUrl = `http://localhost:3000/auth/google/callback?googleId=${googleId}&name=${name}&email=${email}&token=${token}`;
  return res.redirect(redirectUrl);
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
  const { email } = req.body;
  const isUserPresent = await User.findOne({ email });
  if (!isUserPresent) {
    return res.status(404).json("Email not present. Please register");
  }
  const token = await isUserPresent.createJWT();
  const resetLink =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/reset-password?token=${token}`
      : `https://shopease.site/reset-password?token=${token}`;

  const emailSubject = "Recovery Email Password";
  const emailText = `Hi ${isUserPresent.name},

We received a request to reset your password. Click the link below to reset your password:

${resetLink}

If you did not request a password reset, please ignore this email or contact support.

Thank you,
The ProShop Team`;
  const emailHtml = `<p>Hi ${isUserPresent.name},</p>
  <p>We received a request to reset your password. Click the link below to reset your password:</p>
  <p><a href="${resetLink}">Reset Password</a></p>
  <p>If you did not request a password reset, please ignore this email or contact support.</p>
  <p>Thank you,<br>The ProShop Team</p>`;

  const emailSent = await sendEmail(email, emailSubject, emailText, emailHtml);
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
  const { userId } = req.userData;
  const user = await User.findById(userId);
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

const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.userData;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not present");
  }
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not present");
  }
  if (user.wishlist.includes(productId)) {
    user.wishlist = user.wishlist.filter((id) => id != productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  return res.status(200).json(user);
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
  toggleWishlist,
  loginViaGoogle,
  verifyOTP,
};
