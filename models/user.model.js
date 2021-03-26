const mongoose = require('mongoose'); // pour tout ce qui fait ref a la bdd
const { isEmail } = require('validator'); // comme son nom l'indique
const bycrypt = require('bcrypt'); // pour crypter le password

// schema du doc
const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 3,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
            max: 1024,
            minLength: 6
        },
        pictures: {
            type: String,
            default: "./uploads/profil/pic.png"
        },
        bio: {
            type: String,
            max: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String],
        }
    },
    {
        timestamps: true,
    }
)

// Avant les saves executer cette fonction.
userSchema.pre("save",async function(next){
    const salt = await bycrypt.genSalt();
    this.password = await bycrypt.hash(this.password,salt);
    next();
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;