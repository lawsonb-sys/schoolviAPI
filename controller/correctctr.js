const { Correction } = require("../models/corecmodel");
const path = require("path");
const fs = require("fs").promises;

exports.createCorrect = async (req, res) => {
  try {
    // Créer d'abord le document PDF
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier PDF n'a été fourni" });
    }
    const baseURL = "https://schoolviapi.onrender.com"; // Utilisez le port sur lequel votre serveur Express fonctionne
    const pdfPath =
      "/uploads_3/" + path.basename(req.file.path).replace(/\\/g, "/");
    const pdfURL = baseURL + pdfPath;
    // Créer un nouvel exercice
    const newCorrection = new Correction({
      userId: req.body.userId,
      titre: req.body.titre,
      serie: req.body.serie,
      classe: req.body.classe,
      matier: req.body.matier,
      cpdf: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: pdfURL,
      },
    });

    // Sauvegarder l'exercice dans la base de données
    const savedCorrection = await newCorrection.save();

    res.status(201).json({
      message: "Exercice créé avec succès",
      exercice: savedCorrection,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la correction:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la correction" });
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
async function deleteoldPic(oldpath) {
  try {
    const fullPath = path.join("upload_3", oldpath.filename);

    fs.access(fullPath); // Vérifie si le fichier existe
    fs.unlink(fullPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(
        "Le fichier n'existe pas, pas besoin de le supprimer :",
        oldpath
      );
    } else {
      console.error("Erreur lors de la suppression du fichier :", error);
    }
  }
}
exports.updateCorrect = async (req, res) => {
  try {
    let updateData = {
      titre: req.body.titre,
      serie: req.body.serie,
      classe: req.body.classe,
      matier: req.body.matier,
    };

    if (req.file) {
      const baseURL = "https://schoolviapi.onrender.com";
      const pdfPath = "/upload_3/" + req.file.filename;
      const pdfURL = baseURL + pdfPath;

      updateData.cpdf = {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: pdfURL,
      };
    }
    // Supprimer l'ancien fichier PDF si nécessaire
    const oldCorrection = await Correction.findById(req.params.id);

    if (oldCorrection && oldCorrection.cpdf && oldCorrection.cpdf.filename) {
      await deleteoldPic(oldCorrection.cpdf);
    }

    const updatedCorrection = await Correction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedCorrection) {
      return res.status(404).json({ message: "Correction non trouvé" });
    }
    res.json(updatedCorrection);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'Correction:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'Correction" });
  }
};

exports.deleteCorrect = async (req, res) => {
  try {
    const correction = await Correction.findById(req.params.id);
    if (!correction) {
      return res.status(404).json({ message: "Correction non trouvé" });
    }

    // Supprimer le fichier PDF associé
    if (Correction.cpdf && Correction.cpdf.filename) {
      await deleteoldPic(Correction.cpdf);
    }

    await Correction.findByIdAndDelete(req.params.id);
    res.json({ message: "Correction supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'Correction:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'Correction" });
  }
};
exports.delets = async (req, res) => {
  const correction = await Correction.find();
  if (correction.length > 0) {
    await Correction.deleteMany();
    res.status(201).json({ message: "exercices supprimer avec succès" });
  }
};
exports.findcorrectionUiniq = async (req, res) => {
  try {
    const { matier, classe } = req.body;
    const correction = await Correction.find({ matier, classe });
    if (!correction == 0) {
      res.status(404).json({ message: "aucun  Correction na été trouver" });
      return;
    }

    res.json(correction);
  } catch (error) {
    console.error("Erreur lors de la recherche de l'Correction:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche de l'Correction" });
  }
};
