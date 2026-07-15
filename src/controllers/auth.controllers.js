const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

/**
 * - Controller to register a user
 * - POST /api/v1/auth/register
 */

const registerUserController = async (req, res) => {
  const { email, name, password } = req.body;
  const doesUserExist = await User.findOne({ email: email });
  if (doesUserExist) {
    return res.status(422).json({
      message: "User already exists!",
      status: "failed",
    });
  }
  const newUser = await User.create({ email, name, password });
  const token = await jwt.sign(
    { userId: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );
  res.cookie("token", token);
  await emailService.sendRegistrationEmail(newUser.name, newUser.email);
  return res.status(201).json({
    message: "User registered successfully!",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
  });
};

/**
 * - Controller to sign in a user
 * - POST /api/v1/auth/login
 */

const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const doesUserWithEmailExist = await User.findOne({ email: email }).select(
    "+password",
  );
  if (!doesUserWithEmailExist) {
    return res.status(401).json({
      message: "Invalid credentials!",
    });
  }
  const isPasswordValid = await doesUserWithEmailExist.verifyPassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials!",
    });
  }
  const token = await jwt.sign(
    { userId: doesUserWithEmailExist._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );
  res.cookie("token", token);
  return res.status(201).json({
    message: "User logged in successfully!",
    user: {
      _id: doesUserWithEmailExist._id,
      name: doesUserWithEmailExist.name,
      email: doesUserWithEmailExist.email,
    },
    token,
  });
};

module.exports = { registerUserController, loginUserController };
