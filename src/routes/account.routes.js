const express = require("express");
const verifyUser = require("../middlewares/auth.middleware");
const accountControllers = require("../controllers/account.controllers");

const router = express.Router();

router.post(
  "/createAccount",
  verifyUser,
  accountControllers.createAccountController,
);

module.exports = router;
