const express = require("express");
const usercttroller = require("../controller/userctr");
const exoctr = require("../controller/exoctr");
const correctionctr = require("../controller/correctctr");
const {upload,upload2,upload3} =require('../multer/upload');

const router = express.Router();
module.exports = router;
// les routes pour les utilisateurs
router.post("/users/post",upload.single('profile'), usercttroller.createuser);
router.get( '/users', usercttroller.findUsers);
router.get( '/users/login', usercttroller.login);
router.put( '/users/:id', upload.single('profile'),usercttroller.updateUser);
router.delete( '/users/:id', usercttroller.deleteUser);

//les routes pour les exercices

router.post("/exos/post/:id",upload2.single('pdf'), exoctr.createExo);
router.get( '/exos', exoctr.findExo);
router.get( '/exos/serie_classe', exoctr.findExouiniq);
router.put( '/exos/update/:id',upload2.single('pdf'), exoctr.updateExo);
router.delete( '/exos/:id', exoctr.deleteExo);


//Les  routes pour les correction

router.post("/correction/post/:userId",upload3.single('cpdf'), correctionctr.createCorrect);
router.get( '/correction', correctionctr.findCorrect);
router.put( '/correction/update/:id',upload3.single('cpdf'), correctionctr.updateCorrect);
router.delete( '/correction/:id', correctionctr.deleteCorrect);
router.get('/correction/serie_classe',correctionctr.findcorrectionUiniq);





