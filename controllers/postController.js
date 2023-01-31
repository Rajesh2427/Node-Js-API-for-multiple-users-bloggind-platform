const Post = require('../models/postModel')
const AppError = require('../utilites/appError')


exports.getPosts = async (req, res, next)=>{
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 10
    const skip = (page-1) * limit
    
    
     let posts = await Post.find({isPublished : true, ...queryObj}).skip(skip).limit(limit)
    res.status(200).json({
        staus: 'Success',
        count: posts.length,
        data: posts
    })
}

exports.getCategories = async (req, res, next) =>{

 try{ 
      const data = await Post.distinct('category')
 res.status(200).json({
    status: 'Success',
    data,
 })
}catch(err){

}

}

exports.getPost = async (req, res, next)=>{
    try{
    const slug = req.params.slug
       let post = await Post.findOne({slug: slug, isPublished : true}).populate('comments').populate('author')
       res.status(200).json({
           status: 'success',
           data: post
       })
   }catch(err){
       next(new AppError(`${err.message}`, err.statusCode|| 500 ))
   }
   }

exports.createPost = async (req, res, next)=>{
 try{
 const {title, featuredImage, content, contentImages, category, author, tags } = req.body
    let post = await Post.create({title, featuredImage, content, contentImages, category, author, tags})
    res.status(200).json({
        status: 'success',
        data: post
    })
}catch(err){
    if(err.code === 11000){
        res.status(400).json({
            status:'fail',
            message: 'The Title is already used for another post, try to change the Title'
        })
    }
    
    next(new AppError(`${err.message}`, err.statusCode|| 400 ))
}
}

exports.update = async function(req, res, next) {

    try{
        const {title, featuredImage, content, contentImages, category,  tags } = req.body
           let {postId} = req.body
           if(!postId){
               res.status(404).json({
                status:'error',
                message:'Post Id missing '
               })
            return
           }
         let previousPost = await Post.findById(postId)
         if(!previousPost){
            res.status(404).json({
             status:'error',
             message:'we dont have any posts to update with this id'
            })
         return
        }
        //    let post = await Post.save({title, featuredImage, content, contentImages, category, author, tags})
          
        previousPost.title = title
        previousPost.featuredImage = featuredImage
        previousPost.content = content
        previousPost.contentImages = contentImages
        previousPost.category = category
        previousPost.tags = tags
        
        await previousPost.save()


        res.status(200).json({
               status: 'success',
               message:'post updated successfully',
               data: post
           })
       }catch(err){
           if(err.code === 11000){
               res.status(400).json({
                   status:'fail',
                   message: 'The Title is already used for another post, try to change the Title'
               })
           }
           
           next(new AppError(`${err.message}`, err.statusCode|| 400 ))
       }
}

exports.search = async function(req, res, next) {
try{
    const searchTerm = req.params.searchterm
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 10
    const skip = (page-1) * limit
    
    const posts = await Post.find({title: {$regex : searchTerm, $options: 'i'}, isPublished: true}).skip(skip).limit(limit).populate('author')
    
    res.status(200).json({
        status: 'succces',
        count :posts.length,
        page: page,
        data: posts
    })
}catch(err){
    next(new AppError(`${err.message}`, err.statusCode || 500 ))
}
}

exports.deletePost = async (req, res, next) => {
    try{
        const id = req.params.id
           let post = await Post.deleteOne({_id: id})
           res.status(200).json({
               status: 'success',
               message: `Post deleted sucessfully `
           })
       }catch(err){
           next(new AppError(`${err.message}`, err.statusCode|| 400 ))
       }
}

exports.publishPost = async (req, res, next) => {
    console.log('received')
    try{
        const id = req.params.id
        let post = await Post.findByIdAndUpdate(id,{
            isPublished:true
        })
        res.status(200).json({
            status: 'success',
            message: `Post Published sucessfully `
        })
        
    }catch(err){
        console.log(err)
        res.status(204).json({
            status:'error',
            message:'something went wrong pls try again later'
        })
    }

}
