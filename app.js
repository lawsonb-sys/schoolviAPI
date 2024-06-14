const express =require('express');
const bodyParser =require('body-parser');
const mongoosse =require('mongoose');
const app =express();
require('dotenv').config();
const router =require('./routes/routes');
app.use(bodyParser.json());
app.use("/api",router);
app.use(express.urlencoded({extended:true}));

app.use("/",(req,res)=>{
    res.send("Wellecom to your API schoolvi");
})

mongoosse.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
})
port =process.env.PORT || 3001;

app.listen(port,()=>{
    console.log("server is running on",port)
})