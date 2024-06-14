const { Exo , Pdf} = require("../models/exomodel");
const path = require("path");
const fs = require("fs");


exports.createExo = async (req, res) => {
  try {
    
    if (req.file) {
      const pdf = new Pdf({
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        data: req.file.buffer,
      });
      await pdf.save();
     
      const exercice = new Exo({
        userId: req.params.id,
        titre: req.body.titre,
        serie: req.body.serie,
        classe: req.body.classe,
        pdf: pdf._id,
      });
      await exercice.save();

      res.status(201).json({ message: "exercie créé avec succès", data: exercice , pdf:pdf});
    } else {
      res.status(400).json({ message: "fichier introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findExo = async (req, res) => {
  try {
    const exercice = await Exo.find();
    res.status(200).json(exercice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExo = async (req, res) => {
  try {
  const exercice = await Exo.findById(req.params.id);
  const pdf = await Pdf.findById(exercice.pdf);
  if (!exercice) {
    return res.status(404).json({ message: "exercice introuvable" });
  }
const oldPdf = path.join( 'uploads_2', pdf.filename);

if (fs.existsSync(oldPdf)) {
  try {
    fs.unlinkSync(oldPdf);
    
  } catch (err) {
    
    // Gérez l'erreur de manière appropriée
  }
} else {
  
  // Gérez le cas où le fichier est déjà manquant (facultatif)
}
if(!req.file){
  res.status(400).json({ message: "fichier introuvable" });

}
const newpdf =new Pdf({
  filename:req.file.filename,
  mimetype:req.file.mimetype,
  data:req.file.buffer
})
await newpdf.updateOne({_id:exercice.pdf});
await newpdf.save();
exercice.titre = req.body.titre||exercice.titre;
exercice.serie = req.body.serie || exercice.serie;
exercice.classe = req.body.classe || exercice.classe;
exercice.pdf = newpdf._id;
await exercice.save();
res.status(200).json({ message: "exercice mis à jour avec succès", data: exercice, pdf:newpdf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExo = async (req, res) => {
  try {
    const exercice = await Exo.findById(req.params.id);
    const pdf = await Pdf.findById(exercice.pdf);

    const field = path.join("uploads_2",pdf.filename);
    if (fs.existsSync(field)) {
      try {
        fs.unlinkSync(field);
        
      } catch (err) {
        console.error("Erreur lors de la suppression du fichier :", err);
        // Gérez l'erreur de manière appropriée
      }
    } else {
      
      // Gérez le cas où le fichier est déjà manquant (facultatif)
    }
    await pdf.deleteOne();
    await Exo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "fichier supprimer avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findExouiniq = async (req, res) => {
  try {
    const {serie,classe} = req.body;
    const exercice = await Exo.findOne({serie,classe});
   
    if(exercice){
      const pdf = await Pdf.findById(exercice.pdf);
      
      const PDF =[];
      PDF.push(pdf);
      PDF.push(exercice);
      
      res.status(200).json({ message: "exercice trouvé avec succès", data: PDF });
      return;
    }else{
      res.status(404).json({ message: "exercice introuvable" });

    }
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}