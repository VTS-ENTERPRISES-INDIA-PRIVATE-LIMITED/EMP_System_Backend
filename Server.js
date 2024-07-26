const express = require("express");
const bodyParser = require("body-parser");
require('./db')
require('dotenv').config();

const admin = require('./Routes/adminRoutes');
const app = express();

app.use(bodyParser.json());

const port = 4000;

app.get('/test',(req,res)=>{
    res.send("Working");
});

app.use('/admin',admin);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
