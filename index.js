//main import -> express
import express from "express";
//module imports
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = process.env.PORT || 3000;

//use public folder for static files
app.use(express.static("public"));
//use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/",async(req,res)=>{
  res.render("index.ejs",{});
});