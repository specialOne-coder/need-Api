const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline)

module.exports.upladProfil = async (req, res) => {
    try {
        if (req.file.detectedMimeType !== "image/jpg" &&
            req.file.detectedMimeType !== "image/png" &&
            req.file.detectedMimeType !== "image/jpeg")
            throw Error("Invalid file");
        if (req.file.size > 500000) throw Error("Max size : 50mo");
    } catch (error) {
        const errors = uploadErrors(error);
        return res.status(201).json({errors});
    }

    const filename = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
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
        return res.status(500).send({message:err})
    }

}