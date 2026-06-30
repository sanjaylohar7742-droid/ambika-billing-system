const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "India",
    },

    profileImage: {
      type: String,
      default: "/assets/images/default-user.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);