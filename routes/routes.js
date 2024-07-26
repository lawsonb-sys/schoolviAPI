const express = require("express");
const usercttroller = require("../controller/userctr");
const exoctr = require("../controller/exoctr");
const correctionctr = require("../controller/correctctr");
const { upload, upload2, upload3 } = require("../multer/upload");
const path = require("path");
const fs = require("fs");
const router = express.Router();
module.exports = router;

/**
 * @swagger
 * /users/post:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - prenom
 *               - serie
 *               - classe
 *               - profile
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                     type:string
 *               prenom:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               profile:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/users/post", upload.single("profile"), usercttroller.createuser);
/**
 * @swagger
 * /**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste de tous utilisateurs
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - prenom
 *               - serie
 *               - classe
 *               - profile
 *     responses:
 *       201:
 *         description: Liste des utilisateurs
 *       400:
 *         description: Données invalides
 */

router.get("/users", usercttroller.findUsers);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: connection d'un utilisateur
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 *
 *     responses:
 *       201:
 *         description: Utilisateur connecté avec succès
 *       400:
 *         description: mot de pass ou email incorrect
 */
router.post("/users/login", usercttroller.login);
//router.put( '/users/:id', upload.single('profile'),usercttroller.updateUser);

/**
 * @swagger
 * /users/:id:
 *   put:
 *     summary: Mise a jour des donner des utilisateurs
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - prenom
 *               - serie
 *               - classe
 *               - profile
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               prenom:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               profile:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Utilisateur mise a jour avec succès
 *       400:
 *         description: Données invalides
 */
router.put("/users/:id", upload.single("profile"), usercttroller.updateU);
/**
 * @swagger
 * /users/:id:
 *   delete:
 *     summary: Suprimé un utilisateur
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       201:
 *         description: Utilisateur suprimé avec succès
 *       400:
 *         description: Données invalides
 */
router.delete("/users/:id", usercttroller.deleteUser);

//la partie des exercices
/**
 * @swagger
 * /exos/post:
 *   post:
 *     summary: Crée une nouvel fichier
 *     tags: [Exercice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - pdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               pdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Exercice créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/exos/post", upload2.single("pdf"), exoctr.createExo);
/**
 * @swagger
 * /exos:
 *   get:
 *     summary: listes de tous les exercices
 *     tags: [Exercice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - pdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               pdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *
 *
 *     responses:
 *       201:
 *         description:listes des  Exercices
 *       400:
 *         description: Données invalides
 */
router.get("/exos", exoctr.findExo);
/**
 * @swagger
 * /exos/search:
 *   get:
 *     summary: listes de tous les exercices de meme classe et de meme matier
 *     tags: [Exercice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - pdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               pdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *
 *
 *     responses:
 *       201:
 *         description:listes des  Exercices
 *       400:
 *         description: Données invalides
 */
router.get("/exos/search", exoctr.exoUniq);
/**
 * @swagger
 * /exos/update/:id:
 *   put:
 *     summary: Mise a jour des donner des exercices
 *     tags: [Exercice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - pdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               pdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Exercice miser a jour avec succès
 *       400:
 *         description: Données invalides
 */
router.put("/exos/update/:id", upload2.single("pdf"), exoctr.UpdateExo);
/**
 * @swagger
 * /exos/:id:
 *   delete:
 *     summary: Suprimé un exercice
 *     tags: [Exercice]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID des exercice
 *     responses:
 *       201:
 *         description: Exercice suprimé avec succès
 *       400:
 *         description: Données invalides
 */
router.delete("/exos/:id", exoctr.deletexo);
/**
 * @swagger
 * /exos:
 *   delete:
 *     summary: Suprimé toutes les exercice
 *     tags: [Exercice]
 *     responses:
 *       201:
 *         description: Exercice suprimé avec succès
 *       400:
 *         description: Données invalides
 */
router.delete("/exos", exoctr.delets);

//Les  routes pour les correction
/**
 * @swagger
 * /correction/post:
 *   post:
 *     summary: Crée une nouvel fichier de correction
 *     tags: [Correction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - cpdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               cpdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Exercice créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post(
  "/correction/post",
  upload3.single("cpdf"),
  correctionctr.createCorrect
);

/**
 * @swagger
 * /correction:
 *   get:
 *     summary: listes de tous les correction
 *     tags: [Correction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - cpdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               cpdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *
 *
 *     responses:
 *       201:
 *         description:listes des  Correction
 *       400:
 *         description: Données invalides
 */
router.get("/correction", correctionctr.findCorrect);
/**
 * @swagger
 * /exos/update/:id:
 *   put:
 *     summary: Mise a jour des donner des correction
 *     tags: [Correction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - serie
 *               - classe
 *               - cpdf
 *               - userId
 *               - matier
 *             properties:
 *               titre:
 *                 type: string
 *               serie:
 *                 type: string
 *               classe:
 *                 type: string
 *               cpdf:
 *                 type: string
 *               userId:
 *                 type: string
 *               matier:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Correction miser a jour avec succès
 *       400:
 *         description: Données invalides
 */
router.put(
  "/correction/update/:id",
  upload3.single("cpdf"),
  correctionctr.updateCorrect
);
/**
 * @swagger
 * /correction/:id:
 *   delete:
 *     summary: Suprimé un Correction
 *     tags: [Correction]
 *     responses:
 *       201:
 *         description: Correction suprimé avec succès
 *       400:
 *         description: Données invalides
 */
router.delete("/correction/:id", correctionctr.deleteCorrect);
/**
 * @swagger
 * /correction:
 *   delete:
 *     summary: Suprimé tous les Corrections
 *     tags: [Correction]
 *     responses:
 *       201:
 *         description: Correction suprimé avec succès
 *       400:
 *         description: Données invalides
 */
router.delete("/correction", correctionctr.delets);
router.get("/correction/serie_classe", correctionctr.findcorrectionUiniq);
