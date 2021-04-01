const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


// user crud
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

// info d'un utilisateur
module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    (!ObjectID.isValid(req.params.id)) ? res.status(400).send('ID unknow :' + req.params.id)
        : UserModel.findById(req.params.id, (err, docs) => {
            if (!err) res.send(docs);
            else console.log('ID unknown :' + err)
        }).select('-password');
}


// mise à jour d'un utilisateur
module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id)

    try {
        await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(500).send({ message: err })
            }
        )
    } catch (error) {
        return res.send(500).json({ message: error })
    }
}

// suppression d'un utilisateur
module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ messsage: "Suppression réussie" });
    } catch (error) {
        res.status(500).json({ message: error });
    }

}

// follow , unfollow
module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        // ajouter a la liste de following
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        )

        // ajouter a la liste de followers
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )

    } catch (error) {
        res.status(500).json({ message: error });
    }
}

// désabonnement
module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        // retirer de la liste de followers
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        )

        // retirer de la liste de followers
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )


    } catch (error) {
        res.status(500).json({ message: error });
    }
}

