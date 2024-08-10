"use strict";
/* ====================================================== */
/*                     BLOG API CONTROLLERS               */
/* ====================================================== */
// to catch if be able to async errors
require("express-async-errors");
const { BlogCategory, BlogPost, BlogComment } = require("../models/blog");
const User = require("../models/user");


module.exports.BlogPost = {
    list: async (req, res) => {
      /*
          #swagger.tags = ["Posts"]
          #swagger.summary = "List Posts"
          #swagger.description = `
              You can send query with endpoint for search[], sort[], page and limit.
              <ul> Examples:
                  <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                  <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                  <li>URL/?<b>page=2&limit=1</b></li>
              </ul>
          `
      */
      const data = await res.getModelList(BlogPost, {}, [
        // nested populate
        {
          path: "comments",
          select: "content author",
          populate: { path: "author", select: "email" },
        },
        { path: "blogCategoryId", select: "name" },
        { path: "author" },
      ]);
      res.status(200).send({
        error: false,
        detail: await res.getModelListDetails(BlogPost),
        data,
      });
    },
    //   ? when post is created, find the matches category and add the post to matches category posts
    create: async (req, res) => {
      /*
          #swagger.tags = ["Posts"]
          #swagger.summary = "Create Post"
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              schema: {
                  blogCategoryId:"id",
                  author:"id",
                  title: 'Test Post',
                  content:"Test Content Post"
              }
          }
      */
      const data = await BlogPost.create(req.body);
      const category = await BlogCategory.findOne({
        _id: req.body.blogCategoryId,
      });
      const user = await User.findOne({ _id: req.body.author });
      if (!category) {
        return res.status(404).send({
          error: true,
          message: "Categories not found",
        });
      }
      // ? save the post to category posts fields
      category.posts.push(data._id);
      await category.save();
  
      if (!user) {
        return res.status(404).send({
          error: true,
          message: "Users not found",
        });
      }
      user.posts.push(data._id);
      await user.save();
  
      res.status(201).send({
        error: false,
        body: req.body,
        data,
      });
    },
    read: async (req, res) => {
          /*
          #swagger.tags = ["Posts"]
          #swagger.summary = "Get Single Post"
      */
      const data = await BlogPost.find({ _id: req.params.postId }).populate([
        {
          path: "comments",
          select: "content author",
          populate: { path: "author", select: "email" },
        },
        { path: "blogCategoryId", select: "name" },
        { path: "author" },
      ]);
      res.status(202).send({
        error: false,
        data,
      });
    },
    update: async (req, res) => {
      /*
          #swagger.tags = ["Posts"]
          #swagger.summary = "Update Post"
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              schema: {
                  content: 'Test Post'
              }
          }
      */
      const data = await BlogPost.updateOne({ _id: req.params.postId }, req.body);
      const newData = await BlogPost.find({ _id: req.params.postId }).populate([
        {
          path: "comments",
          select: "content author",
          populate: { path: "author", select: "email" },
        },
        { path: "blogCategoryId", select: "name" },
        { path: "author" },
      ]);
      res.status(202).send({
        error: false,
        body: req.body,
        data,
        newData,
      });
    },
    delete: async (req, res) => {
          /*
          #swagger.tags = ["Posts"]
          #swagger.summary = "Delete Post"
      */
      const data = await BlogPost.deleteOne({ _id: req.params.postId });
      const category = await BlogCategory.findOne({ posts: req.params.postId });
      const user = await User.findOne({ _id: req.body.author });
      const comment = await BlogComment.deleteOne({ post: req.params.postId });
  
      if (category) {
        category.posts.pull(req.params.postId);
        await category.save();
      }
      if (user) {
        user.posts.pull(req.params.postId);
        await user.save();
      }
      // if (comment) {
      //   comment.pull(req.params.commentId);
      //   await comment.save();
      // }
      res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
    },
    //   comments: async (req, res) => {
    //     const data = await res.getModelList(
    //       BlogComment,
    //       { post: req.params.postId },
    //       "post"
    //     );
    //     res.status(200).send({
    //       error: false,
    //       detail: await res.getModelListDetails(BlogComment),
    //       data,
    //     });
    //   },
  };