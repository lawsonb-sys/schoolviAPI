const { Correction, CPdf } = require("../models/corecmodel");
const path = require("path");
const fs = require("fs");

exports.createCorrect = async (req, res) => {
  try {
   
    if (req.file) {
      const cpdf = new CPdf({
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        data: req.file.buffer,
      });

      await cpdf.save();
     
      const correction = new Correction({
        userId: req.params.userId,

        titre: req.body.titre,
        serie: req.body.serie,
        classe: req.body.classe,
        cpdf: cpdf._id,
      });
      await correction.save();

      res.status(201).json({
        message: "exercie créé avec succès",
        data: correction,
        pdf: cpdf,
      });
    } else {
      res.status(400).json({ message: "fichier introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findCorrect = async (req, res) => {
  try {
    const correction = await Correction.find();
    res.status(200).json(correction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCorrect = async (req, res) => {

  try {
    const correction = await Correction.findById(req.params.id);

    const pdf = await CPdf.findById(correction.cpdf);

    if (!correction) {
      return res.status(404).json({ message: "exercice introuvable" });
    }
    const oldPdf = path.join("upload_3", pdf.filename);

    if (fs.existsSync(oldPdf)) {
      try {
        fs.unlinkSync(oldPdf);
       
      } catch (err) {
        
        // Gérez l'erreur de manière appropriée
      }
    } else {
      
      // Gérez le cas où le fichier est déjà manquant (facultatif)
    }
    if (!req.file) {
      res.status(400).json({ message: "fichier introuvable" });
    }
    const cnewpdf = new CPdf({
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      data: req.file.buffer,
    });
    await cnewpdf.updateOne({ _id: pdf.id }, { cnewpdf });

    correction.titre = req.body.titre || correction.titre;
    correction.serie = req.body.serie || correction.serie;
    correction.classe = req.body.classe || correction.classe;
    correction.cpdf = cnewpdf._id;
    await correction.save();
    res.status(200).json({
      message: "exercice mis à jour avec succès",
      data: correction,
      pdf: cnewpdf,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCorrect = async (req, res) => {
  try {
    
    const correction = await Correction.findById(req.params.id);

    const pdf = await CPdf.findById(correction.cpdf);

    const field = path.join("upload_3", pdf.filename);
    if (fs.existsSync(field)) {
      try {
        fs.unlinkSync(field);
        
      } catch (err) {
       
        // Gérez l'erreur de manière appropriée
      }
    } else {
      
      // Gérez le cas où le fichier est déjà manquant (facultatif)
    }
    await pdf.deleteOne({ _id: pdf.id });

    await Correction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "fichier supprimer avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findcorrectionUiniq = async (req, res) => {
  try {
    const { serie, classe } = req.body;
    const correction = await Correction.findOne({ serie, classe });
    console.log(correction.cpdf);

    if (correction) {
      const correctpdf = await CPdf.findOne({ _id: correction.cpdf });
      if(!correctpdf){
        res.status(404).json({ message: "le pdf du correction introuvable" });
        return;
      }

      const PDF = [];
      PDF.push(correctpdf);
      PDF.push(correction);

      res
        .status(200)
        .json({ message: "correction trouvé avec succès", data: PDF });
      return;
    } else {
      res.status(404).json({ message: "correction introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
