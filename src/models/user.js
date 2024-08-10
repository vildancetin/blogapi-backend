"use strict";
/*
    BLOG API MODELS
*/
const {mongoose} = require("../configs/dbConnection")


// import hashing password function
const passwordEncrypt = require("../helpers/passwordEncrypt")

const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        required: [true, 'Email field must be required'],
        unique: [true, 'There is this email. Email field must be unique'],
        // ? By checking the conformity of the email according to the statements given.
        validate: [
            (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
            'Email type is not correct.'
        ]
    },
    password:{
        type:String,
        required:true,
        // ? It checks the suitability of the password according to the given expressions and saves it by encrypting it.
        set: (password) => {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
                return passwordEncrypt(password)
            } else {
                throw new Error('Password type is not correct.')
            }
        },
    },
    profilePicture:{
        type:String,
    },
    bio:{
        type:String
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"BlogPost"
    }]
},{
    collection:"user",
    timestamps:true
})
module.exports = mongoose.model("User", UserSchema)