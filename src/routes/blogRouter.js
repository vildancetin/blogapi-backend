"use strict";
/* ====================================================== */
/*                     BLOG API Routes               */
/* ====================================================== */

const router = require("express").Router();
const {BlogPost}=require("../controllers/blogPostController")
const { BlogCategory} = require("../controllers/blogCategoryController");
const { BlogComment} = require("../controllers/blogCommentController");

// ? User permissions added and users will be able to perform operations according to permissions.
const {isAdmin,isLogin,isAdminOrOwn} = require("../middlewares/permissions")

// Blog Category
router.route("/categories").get(isLogin,BlogCategory.list).post(isAdmin,BlogCategory.create);
router
  .route("/categories/:categoryId")
  .get(isLogin,BlogCategory.read)
  .put(isAdmin,BlogCategory.update)
  .patch(isAdmin,BlogCategory.update)
  .delete(isAdmin,BlogCategory.delete);
  
  router.route("/categories/:categoryId/posts").get(isLogin,BlogCategory.posts)

// Blog Post
router.route("/posts").get(isLogin,BlogPost.list).post(isLogin,BlogPost.create);
router
  .route("/posts/:postId")
  .get(isLogin,BlogPost.read)
  .put(isAdminOrOwn,BlogPost.update)
  .patch(isAdminOrOwn,BlogPost.update)
  .delete(isAdminOrOwn,BlogPost.delete);
  // router.route("/posts/:postId/comments").get(BlogPost.comments)

  // Blog Comment
  router.route("/comments").get(isLogin,BlogComment.list).post(isLogin,BlogComment.create);
router
  .route("/comments/:commentId")
  .get(isLogin,BlogComment.read)
  .put(isAdminOrOwn,BlogComment.update)
  .patch(isAdminOrOwn,BlogComment.update)
  .delete(isAdminOrOwn,BlogComment.delete);
  
module.exports = router;
