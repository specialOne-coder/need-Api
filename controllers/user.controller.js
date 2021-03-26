const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


// user crud
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    (!ObjectID.isValid(req.params.id)) ? res.status(400).send('ID unknow :' + req.params.id)
        : UserModel.findById(req.params.id, (err, docs) => {
            if (!err) res.send(docs);
            else console.log('ID unknown :' + err)
        }).select('-password');
}

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

module.exports.deleteUser = async (req, res) =>{
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        await UserModel.remove({_id:req.params.id}).exec();
        res.status(200).json({messsage : "Suppression réussie"});
    } catch (error) {
        res.status(500).json({message : error});
    }
    
}

// follow , unfollow

module.exports.follow = async (req , res) =>{
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        
    } catch (error) {
        res.status(500).json({message : error});
    }
} 

module.exports.unfollow = async (req , res) =>{
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);

    try {
        
    } catch (error) {
        res.status(500).json({message : error});
    }
} 

