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
        return res.status(201).json(err);
    }
}