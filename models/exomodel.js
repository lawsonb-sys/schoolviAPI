const mongoose = require("mongoose");

const exerciceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  titre: {
    type: String,
    required: true,
  },
  matier: {
    type: String,
    required: true,
  },
  serie: {
    type: String,
    required: true,
  },
  classe: {
    type: String,
    required: true,
  },
  pdf: {
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: false,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Exercice = mongoose.model("Exercice", exerciceSchema);

module.exports = Exercice;
