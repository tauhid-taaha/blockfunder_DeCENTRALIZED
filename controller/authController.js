import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, defaultWalletAddress } = req.body;

    // Validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save new user
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      defaultWalletAddress: defaultWalletAddress || "", // Optional, can be added later
      walletAddresses: defaultWalletAddress ? [defaultWalletAddress] : [], // If provided, add to list
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        defaultWalletAddress: user.defaultWalletAddress, // Return wallet info
        walletAddresses: user.walletAddresses,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Add wallet address function
export const addWalletAddressController = async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;

    // Validate input
    if (!userId || !walletAddress) {
      return res.status(400).send({ success: false, message: "User ID and wallet address are required" });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Check if wallet already exists
    if (user.walletAddresses.includes(walletAddress)) {
      return res.status(400).send({ success: false, message: "Wallet address already exists" });
    }

    // Update user wallet addresses
    user.walletAddresses.push(walletAddress);
    if (!user.defaultWalletAddress) {
      user.defaultWalletAddress = walletAddress; // Set as default if no default exists
    }
    await user.save();

    res.status(200).send({
      success: true,
      message: "Wallet address added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        defaultWalletAddress: user.defaultWalletAddress,
        walletAddresses: user.walletAddresses,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding wallet address",
      error,
    });
  }
};

export const testController = (req, res) => {
  console.log("Protected route");
};

