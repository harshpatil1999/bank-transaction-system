const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email already exists!"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+|.[a-zA-Z]{2,}$/,
        "Invalid email!",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [6, "Password should be atleast 6 characters long!"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  return;
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
