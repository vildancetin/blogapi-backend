"use strict";
/* ====================================================== */
/*                     BLOG API Routes               */
/* ====================================================== */

const router = require("express").Router();

const user = require("../controllers/userController");
const {isAdmin,isLogin,isAdminOrOwn} = require("../middlewares/permissions")

// Blog Category
router.route("/").get(isLogin,user.list).post(user.create);
router
  .route("/:userId")
  .get(isLogin,user.read)
  .put(isAdminOrOwn,user.update)
  .patch(isAdminOrOwn,user.update)
  .delete(isAdminOrOwn,user.delete);
module.exports = router;
