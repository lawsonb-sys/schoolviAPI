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
    allowNull: false,
    default: "user",
    enum: ["user", "admin"],
  },
  dateExpiration: {
    type: String,
    allowNull: false,
    default: Date.now(),
  },
  image: {
    type: String,
    allowNull: true,
    default: null,
  },
});

const profileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = mongoose.model("users", UserSchema);
const Profile = mongoose.model("profile", profileSchema);

module.exports = { User, Profile };
