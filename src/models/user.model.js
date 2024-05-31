import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        lowercase : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    fullname : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : [true, "password is required"]
    },
    refreshToken : {
        type : String
    }
},{timestamps : true})

userSchema.pre("save", async function (next) {

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id : this._id,
        username : this.username,
        fullname : this.fullname,
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema)