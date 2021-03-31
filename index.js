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

// options cors pour l'autorisation la bonne communication avec un programme tier
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
app.use(bodyParser.json()); // pour l'envoi des donnés sous format json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // les cookies
// jwt
app.get("*", checkUser); // verification du token à chacque requete de l'user
app.get("/jwtid", requireAuth); // verification a sa venue

// routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

// serveur
app.listen(process.env.PORT, () => {
    console.log(`First test on ${process.env.PORT}`)
})
