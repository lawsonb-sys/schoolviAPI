const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  classe: {
    type: String,
    required: true,
  },
  serie: {
    type: String,
    required: true,
  },

  profile: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "profile",
   required: true
    
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

module.exports = {User, Profile};
