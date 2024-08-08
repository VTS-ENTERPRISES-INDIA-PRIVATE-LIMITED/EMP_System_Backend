const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const employeeRoutes = require('./Routes/employeeRoutes')
require('./db')
// require('dotenv').config();

const admin = require('./Routes/adminRoutes');
const app = express();

app.use(bodyParser.json());
app.use(cors())
const port = 5000;

app.get('/',(req,res)=>{
    res.send("Hello");
});
app.use('/emp',employeeRoutes)
app.use('/admin',admin);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
