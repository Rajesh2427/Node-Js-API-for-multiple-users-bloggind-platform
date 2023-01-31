const {check} = require('express-validator')

const {validationResult} = require('express-validator')

exports.runValidation = ( req, res, next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({error: errors.array()[0].msg})
    }
    next()
}

exports.userSignupValidator = [
    check('userName')
         .not() 
         .isEmpty()
         .withMessage('UserName is required'),
    check('name')
         .not() 
         .isEmpty()
         .withMessage('Name is required'),

    check('email')
         .isEmail()
         .withMessage('Must be a valid email address'),

    check('password')
         .isLength({min: 8})
         .withMessage('Password must be at least 8 characters or more'),
]

exports.userSigninValidator = [

     check('email')
         .isEmail()
         .withMessage('Must be a valid email address'),

      check('password')
         .isLength({min: 6})
         .withMessage('Password must be at least 6 characters or more'),
]
