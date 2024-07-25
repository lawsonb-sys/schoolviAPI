const express = require("express");
const usercttroller = require("../controller/userctr");
const exoctr = require("../controller/exoctr");
const correctionctr = require("../controller/correctctr");
const { upload, upload2, upload3 } = require("../multer/upload");
const path = require("path");
const fs = require("fs");
const router = express.Router();
module.exports = router;
// les routes pour les utilisateurs
router.post("/users/post", upload.single("profile"), usercttroller.createuser);
router.get("/users", usercttroller.findUsers);
router.post("/users/login", usercttroller.login);
//router.put( '/users/:id', upload.single('profile'),usercttroller.updateUser);
router.put("/users/:id", upload.single("profile"), usercttroller.updateU);
router.delete("/users/:id", usercttroller.deleteUser);
router.get(
  "/users/profile",
  express.static(path.join(__dirname, "../uploads/IMAG0097.jpg"))
);

//les routes pour les exercices

router.post("/exos/post", upload2.single("pdf"), exoctr.createExo);
router.get("/exos", exoctr.findExo);
router.get("/exos/search", exoctr.exoUniq);
router.put("/exos/update/:id", upload2.single("pdf"), exoctr.UpdateExo);
router.delete("/exos/:id", exoctr.deletexo);
router.delete("/exos", exoctr.delets);

//Les  routes pour les correction

router.post(
  "/correction/post",
  upload3.single("cpdf"),
  correctionctr.createCorrect
);
router.get("/correction", correctionctr.findCorrect);
router.put(
  "/correction/update/:id",
  upload3.single("cpdf"),
  correctionctr.updateCorrect
);
router.delete("/correction/:id", correctionctr.deleteCorrect);
router.delete("/correction", correctionctr.delets);
router.get("/correction/serie_classe", correctionctr.findcorrectionUiniq);
