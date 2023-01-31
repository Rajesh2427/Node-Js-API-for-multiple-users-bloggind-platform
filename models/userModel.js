const  mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");



const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'UserName is required to signup'],
        unique: [true, 'UserName is already used by someone else.'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required to signup'],
        trim: true,
    },
    email:{
      type: String,
      required:[true, "Email is required to signup"],
      unique: [true, 'Email is already exists'],
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"]
    },
   
    password :{
        type : String,
        required: [true, "Password is required"],
        select: false

    },
    photo : {
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
    },
    role :{
        type : String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    userVerfied:{
        type: Boolean,
        default:false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires : Date,

    passwordResetToken : String,
    passwordResetTokenExpires: Date,
    passwordChangedAt : Date,

    isAccountActive : {
        type : Boolean,
        default: false,
        select: false,
    }
},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
}
)

// Instance methods
UserSchema.methods.createPasswordResetToken = function (){
    const resetToken =  crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

UserSchema.methods.createEmailVerificationToken = function(){
    const  emailToken = crypto.randomBytes(32).toString('hex')
    this.emailVerificationToken = crypto.createHash('sha256').update(emailToken).digest('hex')
    this.emailVerificationTokenExpires = Date.now() + 15 * 60 * 1000
    return emailToken
}

module.exports = new mongoose.model('User', UserSchema);