"use strict";
/* ====================================================== */
/*                     BLOG API CONTROLLERS               */
/* ====================================================== */

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  login: async (req, res) => {
    /*
    #swagger.tags=["Authentication"]
    #swagger.summary="Login"
    #swagger.description="Login with email and password"
    #swagger.parametres["body"]={
      in:"body",
      required:true,
      schema:{
        email:"example@example.com,
        password:"Example123?"}
      } 
    */
    const { email, password } = req.body;

    if (email && password) {
      // ? find the relevant user info and check has token or not.
      const user = await User.findOne({ email, password });
      if (user) {
        // ? check token data
        let tokenData = await Token.findOne({ userId: user._id });
        if (!tokenData) {
          // ? create token data
          const tokenKey = passwordEncrypt(user._id + Date.now());
          tokenData = await Token.create({ userId: user._id, token: tokenKey });
        }
        res.status(200).send({
          error: false,
          token: tokenData.token,
          user,
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong email or password!");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please entry email and password.");
    }
  },
  logout: async (req, res) => {
    /* 
      #swagger.tags=["Authentication"]
      #swagger.summary="Logout"
      #swagger.description="Delete Token" 
    
    */
    // ? If user send token info with headers , check the token info and delete it.
    // ? Token[0]=Token Token[1]=...fndsnfs...
    const auth = req.headers?.authorization || null; //? Token ...asmdsm....
    const tokenKey = auth ? auth.split(" ") : null;
    let deleted = null;
    if (tokenKey && tokenKey[0] === "Token") {
      deleted = await Token.deleteOne({ token: tokenKey[1] });
    }
    res.status(200).send({
      error: false,
      message: "Logot : Tokens deleted",
      deleted,
    });
  },
};
