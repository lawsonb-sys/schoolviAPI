const mongoose = require("mongoose");
const exoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  titre: {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExercicePDF",
    required: true,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const  pdfSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  
});
const Exo = mongoose.model("Exercice", exoSchema);
const Pdf = mongoose.model("ExercicePDF", pdfSchema);

module.exports = { Exo, Pdf };
