import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json("Please fill all details");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(500)
        .json({ msg: "You are not registered. Please Sign Up first" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(500).json({ msg: "Email or password incorrect" });
    }
    const token = user.createJWT();
    user.password = undefined;
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(500).json({ msg: "Please fill all details" });
    }
    const isEmailPresent = await User.findOne({ email });
    if (isEmailPresent) {
      return res
        .status(200)
        .json({ msg: "You are already registered. Please log in" });
    }
    const user = await User.create({ name, email, password });
    const token = user.createJWT();
    user.password = undefined;
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

async function addAddress(req, res) {
  try {
    const { useraddress, userId } = req.body;
    const isUserPresent = await User.findById(userId);
    if (!isUserPresent) {
      return;
    }
    console.log(useraddress);
    const data = await User.findByIdAndUpdate(
      userId,
      {
        address: {
          house: useraddress.address,
          city: useraddress.city,
          postal: useraddress.postal_code,
          country: useraddress.country,
        },
      },
      { new: true }
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

async function updateUser(req, res) {
  try {
    let { name, email, password, id } = req.body;
    const data = await User.findById(id);
    if (!data) {
      return res.status(500).json({ msg: "Email not present" });
    }
    const bodyToUpdate = { name, email };
    if (password.length != 0) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      bodyToUpdate.password = password;
    }
    const user = await User.findByIdAndUpdate(id, bodyToUpdate, {
      new: true,
    });
    console.log(user);
    const token = user.createJWT();
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
  }
}

export { login, signup, addAddress, updateUser };
