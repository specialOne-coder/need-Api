const UserModel = require('../models/user.model');

const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline)

// ajout d'une photo de profil
module.exports.upladProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType !== "image/jpg" &&
            req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg")
            throw Error("invalid file");
        if (req.file.size > 500000) throw Error("max size : 50mo");
    } catch (error) {
        const errors = uploadErrors(error);
        return res.status(201).json({errors});
    }

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/upload/profil/${fileName}`
        )
    )

    try {
        await UserModel.findByIdAndUpdate(
           req.body.userId,
           {$set:{picture:"./upload/profil/"+filename}},
           {new:true,upsert:true,setDefaultsOnInsert:true},
           (err,docs) =>{
               if(!err) return res.send(docs);
               else return res.status(500).send({message:err});
           }
        )
    } catch (error) {
        return res.status(500).send({message:error})
    }

}