const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    allowNull: true,
  },
  prenom: {
    type: String,
    allowNull: true,
  },
  email: {
    type: String,
    unique: false,
    allowNull: true,
  },
  password: {
    type: String,
    allowNull: true,
  },
  classe: {
    type: String,
    allowNull: true,
  },
  serie: {
    type: String,
    allowNull: true,
  },

  profile: {
    type: String,
    allowNull: true,
  },

  role: {
    type: String,
    allowNull: true,
    default: "user",
    enum: ["user", "admin"],
  },

  image: {
    type: String,
    allowNull: true,
    default: null,
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = { User };
