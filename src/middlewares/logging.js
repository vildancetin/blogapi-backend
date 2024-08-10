"use strict"
/* -------------------------------------------------------
    EXPRESS - Blog API logging
------------------------------------------------------- */
// ? save the log day-by-day
// ? get a day and create file with today name and save the logs

const morgan = require("morgan")
const fs=require("node:fs")

const now=new Date() 

const today = now.toISOString().split("T")[0]

const logStream = fs.createWriteStream(`./logs/${today}.log`,{flags:"a+"})
logStream.on('error', (err) => {
    stream.close();
});
module.exports=morgan("combined",{
    stream:logStream
})
