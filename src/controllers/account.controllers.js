const Account = require("../models/account.model");

/**
 * - Controller to create a new account for user
 * - POST /api/v1/accounts/createAccount
 */

const createAccountController = async (req, res) => {
  const user = req.user;
  const newAccount = await Account.create({
    user: user._id,
  });
  return res.status(201).json({
    message: "Account created successfully!",
    newAccount,
  });
};

module.exports = { createAccountController };
