const express = require('express');
const userRoutes = require('./routes/user.routes');
const bodyParser = require('body-parser');
require('dotenv').config({path:'./config/.env'});
require("./config/db.js");
const app = express();

// Middleware
app.use(bodyParser.json());
bodyParser.urlencoded({extended:true});

// routes
app.use('/api/user',userRoutes);

// serveur
app.listen(process.env.PORT, ()=>{
    console.log(`First test on ${process.env.PORT}`)
})