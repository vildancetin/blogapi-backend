"use strict";
/* ====================================================== */
/*                     BLOG API Routes               */
/* ====================================================== */

const router = require("express").Router();
const Token = require("../controllers/tokenController");

// /tokens

router.route("/").get(Token.list).post(Token.create);
// /tokens/:id
router
  .route("/:id")
  .get(Token.read)
  .put(Token.update)
  .patch(Token.update)
  .delete(Token.delete);

  module.exports=router