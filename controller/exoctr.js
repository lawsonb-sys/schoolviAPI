const Exercice = require("../models/exomodel");
const path = require("path");
const fs = require("fs").promises;
const express = require("express");

const multer = require("multer");

// Créer un exercice (déjà vu précédemment)
exports.createExo = async (req, res) => {
  try {
    // Créer d'abord le document PDF
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier PDF n'a été fourni" });
    }
    const baseURL = "https://schoolviapi.onrender.com"; // Utilisez le port sur lequel votre serveur Express fonctionne
    const pdfPath =
      "/uploads_2/" + path.basename(req.file.path).replace(/\\/g, "/");
    const pdfURL = baseURL + pdfPath;
    // Créer un nouvel exercice
    const newExercice = new Exercice({
      userId: req.body.userId,
      titre: req.body.titre,
      serie: req.body.serie,
      classe: req.body.classe,
      matier: req.body.matier,
      pdf: {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: pdfURL,
      },
    });

    // Sauvegarder l'exercice dans la base de données
    const savedExercice = await newExercice.save();

    res.status(201).json({
      message: "Exercice créé avec succès",
      exercice: savedExercice,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'exercice:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'exercice", error });
  }
};

// Lire tous les exercices
exports.findExo = async (req, res) => {
  try {
    const exercices = await Exercice.find();
    res.json(exercices);
  } catch (error) {
    res.status(500).json({ message: "Exercice non trouvé" });
  }
};

async function deleteoldPic(oldpath) {
  try {
    const fullPath = path.join("uploads_2", oldpath.filename);
    console.log("voici le path:", fullPath);
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

// Lire un exercice spécifique
exports.UpdateExo = async (req, res) => {
  try {
    let updateData = {
      titre: req.body.titre,
      serie: req.body.serie,
      classe: req.body.classe,
      matier: req.body.matier,
    };

    if (req.file) {
      const baseURL = "https://schoolviapi.onrender.com";
      const pdfPath = "/uploads_2/" + req.file.filename;
      const pdfURL = baseURL + pdfPath;

      updateData.pdf = {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: pdfURL,
      };
    }
    // Supprimer l'ancien fichier PDF si nécessaire
    const oldExercice = await Exercice.findById(req.params.id);
    if (oldExercice && oldExercice.pdf && oldExercice.pdf.filename) {
      await deleteoldPic(oldExercice.pdf);
    }

    const updatedExercice = await Exercice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedExercice) {
      return res.status(404).json({ message: "Exercice non trouvé" });
    }
    res.json(updatedExercice);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'exercice:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'exercice" });
  }
};

exports.deletexo = async (req, res) => {
  try {
    const exercice = await Exercice.findById(req.params.id);
    if (!exercice) {
      return res.status(404).json({ message: "Exercice non trouvé" });
    }
    console.log("voici lexo:", exercice);

    // Supprimer le fichier PDF associé
    if (exercice.pdf && exercice.pdf.filename) {
      await deleteoldPic(exercice.pdf);
    }

    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: "Exercice supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'exercice:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'exercice" });
  }
};
exports.delets = async (req, res) => {
  const exercice = await Exercice.find();
  if (exercice.length > 0) {
    await Exercice.deleteMany();
    res.status(201).json({ message: "exercices supprimer avec succès" });
  }
};

exports.exoUniq = async (req, res) => {
  try {
    const { matier, classe } = req.body;
    const exercices = await Exercice.find({ matier, classe });
    if (exercices == 0) {
      res.status(404).json({ message: "aucun  exercice na été trouver" });
      return;
    }

    res.json(exercices);
  } catch (error) {
    console.error("Erreur lors de la recherche de l'exercice:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche de l'exercice" });
  }
};
