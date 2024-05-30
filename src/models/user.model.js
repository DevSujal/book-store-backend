import mongoose from "mongoose"


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

export const User = mongoose.model("User", userSchema)