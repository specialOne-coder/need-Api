const mongoose = require('mongoose');

mongoose
    .connect("mongodb://localhost:27017/need",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Erreur", err));
