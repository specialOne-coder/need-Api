const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true,
            maxLength: 500,
        },
        message:{
            type:String,
            trim:true,
            maxLength:500,
        },
        picture: {
            type: String,
        },
        video: {
            type: String,
        },
        likers: {
            type: [String],
            required: true
        },
        comments: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamp: Number
                }
            ],
            required:true,
        },
    },
    {
        timestamp:true,
    }
);

module.exports = mongoose.model('post',postSchema);