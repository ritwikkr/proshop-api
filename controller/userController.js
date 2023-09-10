import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import User from "../model/userSchema.js";
import sendPasswordResetEmail from "../middleware/sendMail.js";

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ error: "Please fill all details" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(500)
        .json({ error: "User not registered!. Please register first" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(500).json({ error: "Email or Password incorrect" });
    }
    const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      return res.status(500).json({ error: "Please fill all details" });
    }
    if (password !== confirmPassword) {
      return res.status(500).json({ error: "Passwords do not match" });
    }
    const isEmailPresent = await User.findOne({ email });
    if (isEmailPresent) {
      return res
        .status(500)
        .json({ error: "You are already registered. Please log in" });
    }
    const user = await User.create({ name, email, password });
    const token = user.createJWT();
    user.password = undefined;
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function addAddress(req, res) {
  try {
    const { useraddress, userId } = req.body;
    const isUserPresent = await User.findById(userId);
    if (!isUserPresent) {
      return res.status(500).json({ error: "Email not present" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        address: {
          name: useraddress.name,
          phoneNumber: useraddress.phoneNumber,
          address: useraddress.address,
          city: useraddress.city,
          state: useraddress.state,
          postal: useraddress.postal_code,
          country: useraddress.country,
        },
      },
      { new: true }
    );
    const token = user.createJWT();
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function updateUser(req, res) {
  try {
    let { name, email, password, id } = req.body;
    const data = await User.findById(id);
    if (!data) {
      return res.status(500).json({ error: "Email not present" });
    }
    const bodyToUpdate = { name, email };
    const user = await User.findByIdAndUpdate(id, bodyToUpdate, {
      new: true,
    });
    const token = user.createJWT();
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function updatePassword(req, res) {
  try {
    const { passwordDetails, id } = req.body;
    const isUserPresent = await User.findById(id);
    const isPasswordCorrect = await isUserPresent.comparePassword(
      passwordDetails.currPassword
    );
    if (!isPasswordCorrect) {
      return res.status(500).json({ message: "Old Password Incorrect" });
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
  } catch (error) {
    res.status(500).json(error);
  }
}

async function forgotPassword(req, res) {
  try {
    const { user } = req.body;
    const isUserPresent = await User.findOne({ email: user });
    if (!isUserPresent) {
      return res.status(400).json("Email Not Present");
    }
    const token = await isUserPresent.createJWT();

    const resetLink = `https://localhost:3000/reset-password?token=${token}`;
    sendPasswordResetEmail(isUserPresent.email, resetLink);
  } catch (error) {
    console.log(error);
  }
}

export {
  login,
  signup,
  addAddress,
  updateUser,
  updatePassword,
  forgotPassword,
};
