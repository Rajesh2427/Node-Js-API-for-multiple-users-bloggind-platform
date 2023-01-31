const Comment = require('../models/commentModel')
const AppError = require('../utilites/appError')


exports.getComments = async (req, res)=>{
 
    let comments = await Comment.find()
    res.status(200).json({
        staus: 'Success',
        data: comments
    })
}
exports.createComment = async (req, res, next)=>{
 try{
 const {name, email, comment, post} = req.body
    let comments = await Comment.create({name, email, comment, post})
    res.status(200).json({
        status: 'success',
        data: comments
    })
}catch(err){
    next(new AppError(`${err.message}`, err.statusCode|| 500 ))
}
}