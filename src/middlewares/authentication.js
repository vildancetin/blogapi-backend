"use strict";
/* -------------------------------------------------------
    EXPRESS - Blog API
------------------------------------------------------- */
const Token = require("../models/token");
module.exports = async (req, res, next) => {
    // ? if the token info in headers you have to check the token who has.
  const auth = req.headers?.authorization || null;
  const tokenKey = auth ? auth.split(" ") : null;
  if (tokenKey && tokenKey[0] === "Token") {
    const tokenData = await Token.findOne({ token: tokenKey[1] }).populate("userId");
    if(tokenData){
        req.user = tokenData.userId // ? I can access to user info anymore with use req
    }
  }
  next()
};
