const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const AppError = require('../utilites/appError')
const Email = require('../utilites/email')
const { ConversationsMessageFile } = require('sib-api-v3-sdk')

//Token creation
const createSendToken = (user, statusCode, req, res) => {
  const { _id, photo, userName, name, email, role } = user
   
    const token = jwt.sign({ id : user._id}, process.env.JWT_SECRETKEY, {expiresIn: process.env.JWT_EXPIRES_IN });
    
    let cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      
      

    }

    // if(process.env.NODE_ENV === 'production')  cookieOptions.secure = req.secure || req.headers['x-forwarded-proto'] === 'https' ;
   
    res.cookie('jwt', token, cookieOptions);
   
    res.status(statusCode).json({ token, user:{ _id, userName, name, email, photo, role}})
}   
// UsersHandlers
const signup = async (req, res, next) =>{

    
    try{ 
    const {userName, name, email, password, photo} = req.body
    let hashPassword = bcrypt.hashSync(password, 12)
    const newUser = await User.create({userName, name, email, password : hashPassword, photo})
    let emailToken = await newUser.createEmailVerificationToken()
    await newUser.save({ validateBeforeSave: false });
    const verifyUrl = `${process.env.CLIENT_URL}/user/verifyemail/?token=${emailToken}`
    await new Email({
      email: email,
      name:name,
      
    }, verifyUrl).sendVerifyEmail();
    
    res.status(200).json({
      status:'success',
      message:`Registration was successful, verify your email. A verification mail was sended to your email address ${email}`
    })
    }catch(err){
      if(err.code === 11000){
        res.status(400).json({message: err.keyPattern})
        return
      }
      newUser.emailVerificationToken = undefined;
      newUser.emailVerificationTokenExpires = undefined;
      await newUser.save()
      // console.log(err)
        res.status(400).json({message: err.message})
      // next(new AppError(err.message, 400))
    }
}

const signin = async (req, res, next) =>{

    let { email, password } = req.body;

  try{
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
   
    const user = await User.findOne({ email }).select('+password +isAccountActive');
    if(!user){
      res.status(400).json({
        status: 'error',
        message:'Please check your E-Mail Address. There is no account associated with this email address'
    })
    return;
    }

    if(user.isAccountActive === false){
      res.status(400).json({
        status: 'error',
        message:'Your Account is not active'
    })
      return;
    }
    
      if(user.email === email && bcrypt.compareSync(password, user.password) ){
         createSendToken(user, 200, req, res)
         return;
      }
        res.status(400).json({
            status: 'error',
            message:'Please check your Password'
        })
      
     
  } catch(err){
    next(new AppError('Something went wrong please try again later', 500))
  } 

}

const forgetPassword = async (req, res, next) => {
  const user  = await User.findOne({ email: req.body.email}) 

  if(!user){
    res.status(200).json({status:'error', message:'we Could not find any account with this email'})
    return;
  }

  let resetToken = await user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false });
  // console.log(resetToken)
  try {
    const resetURL = `${process.env.CLIENT_URL}/user/resetpassword/?token=${resetToken}`;
    await new Email({
      email: user.email,
      name: user.name,
      
    }, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: `Password reset link sent successfully to your ${req.body.email}`
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

   next(
      new AppError('There was an error sending the email. Try again later!'),
      400
    );

  
  }

}

const resetPassword = async (req, res, next) => {
  const token = req.params.token

  const currentPassword = req.body.currentPassword
 

  const hashedToken = await crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({passwordResetToken : hashedToken, passwordResetTokenExpires : {$gt: Date.now()}}).select('+password')
 
  if(!user){
    return res.status(200).json({
      status:'error',
      message:'Invalid or Token has Expired'
    })
  }
try{


  let hashPassword = bcrypt.hashSync(req.body.currentPassword, 12)
  user.password = hashPassword
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save()

 res.status(200).json({
    status:'success',
    message:'Your new password updated successfully, you will be redirected to login page'
  })
return;
}catch(err){
  res.status(500).json({
    status:'error',
    message:'Something went wrong please try again later'
  })
}
  
  //  createSendToken(user, 200, req, res)
  
}

const updatePassword = async (req, res, next) => {
  try{
const user = await User.findById(req.userid).select('+password')

if(! bcrypt.compareSync(req.body.currentPassword, user.password)){
 return res.status(401).json({
    status:'error',
    message: 'Your Existing password is incorrect'
  })

}
let hashPassword = bcrypt.hashSync(req.body.newPassword, 12)
user.password = hashPassword
await user.save()

res.status(200).json({
  message: 'Your password changed successfully'
})
  }catch(error){
    // next(new AppError(error.message, 400))
    res.status(401).json({
      status:'error',
      message: 'Something went wrong please try later'
    })
  }

}

const verifyEmail = async (req, res, next) => {
  
  const hashedToken = await crypto.createHash('sha256').update(req.query.token).digest('hex');

  const user = await User.findOne({emailVerificationToken : hashedToken, emailVerificationTokenExpires : {$gt: Date.now()}}).select('+isAccountActive')

  if(!user){
    return res.status(200).json({
      status:'error',
      message:'Invalid or Token has Expired'
    })
    // next(new AppError('Invalid or Token has Expired', 400))
    
  }
  try{
  user.isAccountActive = true
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save()
   
  res.status(200).json({
    status: 'success',
    message:'Email Verified. your will be redirected to Login Page'
  })
  }catch(err){
    res.status(200).json({
      status:'error',
      message:'something went wrong pls try again or contact admin via trustednewsofficial@gmail.com'
    })
  }


}



module.exports = {
    signup,
    signin,
    forgetPassword,
    resetPassword,
    updatePassword,
    verifyEmail
}