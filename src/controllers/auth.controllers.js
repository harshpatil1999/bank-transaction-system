const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
  return res.status(201).json({
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
  });
};

module.exports = { registerUserController };
