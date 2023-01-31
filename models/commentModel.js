const mongoose = require('mongoose');
const validator = require('validator');

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate:[validator.isEmail, 'Email is not valid']
    },
    comment : {
        type: String,
        required: [true, 'Comment is required'],
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Comment belongs to this post']
    }

},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}
)


const Comment = new mongoose.model('Comment', commentSchema)

module.exports = Comment