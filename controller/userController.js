import bcrypt from "bcryptjs";

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
    const { userAddress, userId } = req.body;
    const isUserPresent = await User.findById(userId);
    if (!isUserPresent) {
      return res.status(500).json({ error: "Email not present" });
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

    const resetLink = `https://myproshop.netlify.app/reset-password?token=${token}`;
    // const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const emailSent = await sendPasswordResetEmail(
      isUserPresent.email,
      resetLink
    );
    if (!emailSent) {
      return res.status(400).json("Error");
    }
    res.status(200).json("Email Sent Successfully");
  } catch (error) {
    console.log(error);
  }
}

async function deleteAddress(req, res) {
  try {
    const { userId, addressId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json("User not present");
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
  } catch (error) {
    console.log(error);
  }
}

async function resetPassword(req, res) {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(400).json("User not found");
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json("Password reset successfully");
  } catch (error) {
    console.log(error);
  }
}

async function checkJWTExpiry(req, res) {
  try {
    res.status(200).json(true);
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
  deleteAddress,
  resetPassword,
  checkJWTExpiry,
};
