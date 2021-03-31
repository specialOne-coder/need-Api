const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './config/.env' });
require("./config/db.js");
const { checkUser, requireAuth } = require("./middlewre/auth.middleware");
const app = express();
const cors = require('cors');

const corsOptions = {
    origin:process.env.CLIENT_URL,
    credentials:true,
    'allowedHeaders':['sessionId','content-Type'],
    'exposedHeaders':['sessionId'],
    'methods':'GET,HEAD,PUR,PATCH,POST,DELETE',
    'preflightContinue':false
}

app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth);

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// serveur
app.listen(process.env.PORT, () => {
    console.log(`First test on ${process.env.PORT}`)
})
