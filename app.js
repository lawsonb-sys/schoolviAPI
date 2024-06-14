const express =require('express');
const bodyParser =require('body-parser');
const mongoosse =require('mongoose');
const app =express();
const router =require('./routes/routes');
app.use(bodyParser.json());
app.use("/api",router);
app.use(express.urlencoded({extended:true}));


mongoosse.connect('mongodb://localhost:27017/schoolvi',{
    useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.listen(3001,()=>{
    console.log("server is running ....")
})