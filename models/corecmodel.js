const mongoose = require("mongoose");


const correctSchema = new mongoose.Schema({
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
 cpdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CorrectPDF",
    required: true,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const  cpdfSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  data: Buffer,
  
});
const Correction = mongoose.model("Correction", correctSchema); 
const CPdf = mongoose.model("CorrectPDF", cpdfSchema);

module.exports = { Correction, CPdf };