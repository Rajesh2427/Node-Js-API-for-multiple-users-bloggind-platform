const User = require('../models/userModel')
const AppError = require('../utilites/appError')

restrictAdmin = async (req, res, next) => {
    const id = req.userid
    const user = await User.findById({_id: id})
   
    if(user.role === 'admin'){
        next()
        return;
    }else{
        next(new AppError('You dont have permission to perform this action', 400))
    }
    
}

module.exports = restrictAdmin