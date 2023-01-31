const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
    title : {
        type: String,
        unique: true,
        required: [true, "Title is required to create a post"],
    },

    slug : {
        type: String,
    },

    featuredImage :{
        type: String,
        default: 't.ly/_jGt'
    },
    content:{
        type: String,
        required: [true, "Content is required to create a post"],
    },
    contentImages:[String],
    category : {
        type: String,
        default:'Featured'
    },
    tags: [String],
    isPublished: {
        type: Boolean,
        default: false,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required to create a post']
    }

},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}
)

// Indexes
postSchema.index({name: 'title'})

//virtual Populate
postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField : 'post',
    localField: '_id'

})



//document middlware
postSchema.pre('save', function(next){
this.slug = slugify(this.title, {lower : true});

 next()
})



const Post = new mongoose.model('Post', postSchema)

module.exports = Post