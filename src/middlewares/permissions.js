"use strict";
/* -------------------------------------------------------
    EXPRESS - Blog API Permissions
------------------------------------------------------- */
const { BlogPost ,BlogComment} = require("../models/blog");
const User = require("../models/user");

// ? Users will be able to perform operations according to permissions.
module.exports = {
    // ? user login or not. We can get info from req.user 
  isLogin: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("No Permissions:You must login.");
    }
  },
//   ? User role is admin or not 
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role == "admin") {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("No Permissions:You must login and to be Admin");
    }
  },
//   ? Each user will be able to make changes according to whether own post or own user or own comment. And can take the info from url params.
  isAdminOrOwn: async (req, res, next) => {
    const { postId, userId, commentId } = req.params;
    if (req.user) {
      if (postId) {
        const post = await BlogPost.findOne({ _id: postId });
        const isPostOwner = post && req.user._id.equals(post.author);
        if (isPostOwner || req.user.role == "admin") {
          next();
        } else {
          res.errorStatusCode = 403;
          throw new Error(
            "NoPermission: You must login and to be Admin or Record Owner."
          );
        }
      }
      if (userId) {
        const user = await User.findOne({ _id: userId });

        const isUserOwner = user && req.user._id.equals(user._id);
        if (isUserOwner || req.user.role == "admin") {
          next();
        } else {
          res.errorStatusCode = 403;
          throw new Error(
            "NoPermission: You must login and to be Admin or Record Owner."
          );
        }
      }
      if (commentId) {
        const comment = await BlogComment.findOne({ _id: commentId });

        const isCommentOwner = comment && req.user._id.equals(comment.author);
        if (isCommentOwner || req.user.role == "admin") {
          next();
        } else {
          res.errorStatusCode = 403;
          throw new Error(
            "NoPermission: You must login and to be Admin or Record Owner."
          );
        }
      }
    } else {
      res.errorStatusCode = 400;
      throw new Error("No Permission:You must login.");
    }
  },
};
