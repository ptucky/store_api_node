const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    //   createdAt: Date.now(), // MongoDB no need
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", UserSchema);
