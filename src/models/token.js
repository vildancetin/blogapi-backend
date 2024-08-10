"use strict";
/*
    BLOG API MODELS
*/
const {mongoose} = require("../configs/dbConnection")

const TokenSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
        index:true
    },
    token:{
        type:String,
        unique:true,
        trim:true,
        index:true,
        required:true
    }
},{
    collection:"token",
    timestamps:true
})

module.exports = mongoose.model("Token",TokenSchema)