const { profile } = require("console");
const { User, Profile } = require("../models/usermodel");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.createuser = async (req, res) => {
  try {
    const userdata = req.body;

    if (req.file) {
      const baseURL = "https://schoolviapi.onrender.com";
      userdata.profile =
        "/uploads/" + path.basename(req.file.path).replace(/\\/g, "/");
      userdata.image = baseURL + userdata.profile;
      //  await updateUser.save();
    }
    const user = new User(userdata);
    await user.save();

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userUp = await User.findById(req.params.id);
    const profiles = await Profile.findById(userUp.profile);

    if (!userUp) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const oldpath = path.join("uploads", profiles.filename);
    console.log("oldpath :", oldpath);
    if (fs.existsSync(oldpath)) {
      try {
        fs.unlinkSync(oldpath);
        console.log("Fichier supprimé avec succès :", oldpath);
      } catch (err) {
        console.error("Erreur lors de la suppression du fichier :", err);
        // Gérez l'erreur de manière appropriée
      }
    } else {
      console.log("Fichier introuvable :", oldpath);
      // Gérez le cas où le fichier est déjà manquant (facultatif)
    }

    if (!req.file) {
      res.status(404).json({ message: "photo non trouvé" });
    }
    const profile = new Profile({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });
    await profile.updateOne({ _id: userUp.profile });
    await profile.save();

    console.log("voici :", profile.filename);

    userUp.name = req.body.name || userUp.name;
    userUp.prenom = req.body.prenom || userUp.prenom;
    userUp.email = req.body.email || userUp.email;
    userUp.password = req.body.password || userUp.password;
    userUp.serie = req.body.serie || userUp.serie;
    userUp.classe = req.body.classe || userUp.classe;
    userUp.role = req.body.role || userUp.role;
    userUp.dateExpiration = req.body.dateExpiration || userUp.dateExpiration;
    userUp.profile = profile._id;

    await userUp.save();

    res.status(200).json({
      message: "Utilisateur modifié avec succès",
      data: userUp,
      data2: profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
async function deleteoldPic(oldpath) {
  try {
    const fullPath = path.join(__dirname, "..", oldpath);
    await fs.access(fullPath); // Vérifie si le fichier existe
    await fs.unlink(fullPath);
    console.log("Fichier supprimé avec succès :", fullPath);
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
exports.updateU = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = req.body;
    console.log("prenom :", user);
    const curentUser = await User.findById(userid);

    if (!curentUser) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const updateUser = await User.findByIdAndUpdate(userid, user, {
      new: true,
    });
    if (req.file) {
      if (curentUser.profile) {
        await deleteoldPic(curentUser.profile);
      }
      const baseURL = "https://schoolviapi.onrender.com";
      updateUser.profile =
        "/uploads/" + path.basename(req.file.path).replace(/\\/g, "/");
      updateUser.image = baseURL + updateUser.profile;
      await updateUser.save();
    }

    res.json(updateUser);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification de l'utilisateur",
      error: error.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const profiles = await Profile.findById(user.profile);

    const field = path.join("uploads", user.profile);
    if (fs.existsSync(field)) {
      try {
        fs.unlinkSync(field);
        console.log("Fichier supprimé avec succès :", field);
      } catch (err) {
        console.error("Erreur lors de la suppression du fichier :", err);
        // Gérez l'erreur de manière appropriée
      }
    } else {
      console.log("Fichier introuvable :", field);
      // Gérez le cas où le fichier est déjà manquant (facultatif)
    }
    await profiles.findByIdAndDelete(user.profile);
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Utilisateur supprimer avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
