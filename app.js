const express = require("express");
const bodyParser = require("body-parser");
const mongoosse = require("mongoose");
const app = express();
require("fs").promises;
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const router = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("swagger-jsdoc");
const { info } = require("console");
const { title } = require("process");
const { url } = require("inspector");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Schoolvi API",
      version: "1.0.0",
      description: "Documentation de mon API Schoolvi avec swagger",
    },
    servers: [
      { url: `http://localhost:3001`, description: "Development server" },
      {
        url: `https://schoolviapi.onrender.com`,
        description: " server de production",
      },
    ],
  },
  apis: ["./routes/routes.js"],
};
const swaggerSpec = swaggerDocument(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.json());
app.use("/api", router);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads_2", express.static(path.join(__dirname, "uploads_2")));
app.use("/upload_3", express.static(path.join(__dirname, "upload_3")));

/*app.use("/", (req, res) => {
  res.send("Wellecom to your oooh my API schoolvi");
});*/
app.get("/image/up/:img", (req, res) => {
  const imagePath = path.join(__dirname, "uploads/", req.params.img);

  // Vérifier si le fichier image existe

  fs.promises
    .access(imagePath, fs.constants.F_OK)
    .then(() => res.sendFile(imagePath)) // Envoyer l'image si elle existe
    .catch(() => res.status(404).send("Image introuvable")); // Envoyer une erreur si elle n'est pas trouvée
});

mongoosse.connect(process.env.MONGO_URL, {});
port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("server is running on", port);
});
