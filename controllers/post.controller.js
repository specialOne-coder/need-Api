const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline)


// liste des différents posts
module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data :' + err);
    }).sort({ createdAt: -1 });
}

// création d'un post
module.exports.createPost = async (req, res) => {

    let fileName;
    if(req.file !== null){
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
    
        fileName = req.body.posterId +Date.now()+ ".jpg";
    
        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        )
    }

    const newPost = new postModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture:req.file !== null ? "./upload/posts/"+fileName : '',
        video: req.body.video,
        likers: [],
        comments: [],
    });

    try {
        const post = await newPost.save();
        return res.status(201).send(post);
    } catch (error) {
        return res.status(400).json(error);
    }

}

// modification d'un post
module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);
    const updatedPost = {
        message: req.body.message
    };

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedPost },
        { new: true, upsert: true, setDefaultsOnInsert: false },
        (err, docs) => {
            if (!err) res.send(docs)
            else console.log('Erreur de modif' + err);
        }
    )

}

// suppression d'un post
module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) => {
            if (!err) res.send(docs)
            else console.log('Erreur de suppression' + err);
        }
    )

}

// like
module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err);
            }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            { $addToSet: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (!err) return res.status(400).send(docs)
                else return res.status(400).send(err);
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
}


// unlike
module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },
            (err, docs) => {
                if (err) return res.status(400).send(err);
            }
        );

        await UserModel.findByIdAndUpdate(
            req.body.id,
            { $pull: { likes: req.params.id } },
            { new: true },
            (err, docs) => {
                if (!err) return res.status(400).send(docs)
                else return res.status(400).send(err);
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }
}

// ajout d'un commentaire
module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);
    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        );
    } catch (error) {
        return res.status(400).send(error);
    }
}

// mise à jour d'un  commentaire
module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);
    try {
        return PostModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find((comment) =>
                comment._id.equals(req.body.commentId)
            )
            if (!theComment) return res.status(404).send('Comment not found')
            theComment.text = req.body.text;
            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            })
        }
        )
    } catch (error) {
        res.status(400).send(error);
    }
}

// suppression d'un commentaire
module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) return res.status(400).send('ID unknow : ' + req.params.id);
    try {
        return PostModel.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    comments: { _id: req.body.commenterId }
                }
            },
            { new: true },
            (err, docs) => {
                if (!err) return res.status(200).send(docs);
                else return res.status(400).send(err);
            })
    } catch (error) {
        return res.status(400).send(err);
    }

}

