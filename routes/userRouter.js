const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

const fileupload = require('../middlewares/fileUpload')
//validators
const isAuthorized = require('../validators/isAuthorized')
const {runValidation} = require('../validators/detailsValidator')
const {userSignupValidator ,userSigninValidator} = require('../validators/detailsValidator')

router.post('/signup',fileupload.single('image'), userSignupValidator, runValidation,  userController.signup)
router.post('/signin',userSigninValidator, runValidation, userController.signin)
router.post('/forgetpassword', userController.forgetPassword)
router.post('/resetpassword/:token', userController.resetPassword)
router.post('/updatepassword', isAuthorized, userController.updatePassword)
router.get('/verifyemail',  userController.verifyEmail)


module.exports = router