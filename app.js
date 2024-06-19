const express =require('express');
const bodyParser =require('body-parser');
const mongoosse =require('mongoose');
const app =express();
require('fs').promises;
const path =require('path');
const fs =require('fs')
require('dotenv').config();
const router =require('./routes/routes');
app.use(bodyParser.json());
app.use("/api",router);
app.use(express.urlencoded({extended:true}));

 /*app.use("/",(req,res)=>{
    res.send("Wellecom to your oooh my API schoolvi");
})*/
app.get('/image/up/:img', (req, res) => {
    const imagePath = path.join(__dirname,"uploads/",req.params.img);
  console.log('img:',imagePath);
    // Vérifier si le fichier image existe
    
    fs.promises.access(imagePath, fs.constants.F_OK)
      .then(() => res.sendFile(imagePath)) // Envoyer l'image si elle existe
      .catch(() => res.status(404).send('Image introuvable')); // Envoyer une erreur si elle n'est pas trouvée
  });
mongoosse.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
})
port =process.env.PORT || 3001;

app.listen(port,()=>{
    console.log("server is running on",port)
})


