"use strict";
/* ====================================================== */
/*                     BLOG API CONTROLLERS               */
/* ====================================================== */
// to catch if be able to async errors
require("express-async-errors");
const { BlogPost, BlogComment } = require("../models/blog");

module.exports.BlogComment = {
    list: async (req, res) => {
      /*
          #swagger.tags = ["Comments"]
          #swagger.summary = "List Comments"
          #swagger.description = `
              You can send query with endpoint for search[], sort[], page and limit.
              <ul> Examples:
                  <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                  <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                  <li>URL/?<b>page=2&limit=1</b></li>
              </ul>
          `
      */
      const data = await res.getModelList(BlogComment, {}, [
        { path: "author", select: "email" },
        { path: "post", select: "title" },
      ]);
      res.status(200).send({
        error: false,
        detail: await res.getModelListDetails(BlogComment),
        data,
      });
    },
    create: async (req, res) => {
          /*
          #swagger.tags = ["Comments"]
          #swagger.summary = "Create Comment"
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              schema: {
                  post:"id",
                  author:"id",
                  content:"Test Content Comment"
              }
          }
      */
      try {
        // ? create a new comment and saves the comment to the relevant post
        const data = await BlogComment.create(req.body);
        const post = await BlogPost.findOne({ _id: req.body.post });
        if (!post) {
          return res.status(404).send({
            error: true,
            message: "Posts not found",
          });
        }
        // ? save the comment to post
        post.comments.push(data._id);
        await post.save();
  
        res.status(201).send({
          error: false,
          body: req.body,
          data,
        });
      } catch (error) {
        res.status(500).send({
          error: true,
          message: error.message,
        });
      }
    },
    read: async (req, res) => {
          /*
          #swagger.tags = ["Comments"]
          #swagger.summary = "Get Single Comment"
      */
      const data = await BlogComment.find({ _id: req.params.commentId }).populate(
        [
          { path: "author", select: "email" },
          { path: "post", select: "title" },
        ]
      );
      res.status(202).send({
        error: false,
        data,
      });
    },
    update: async (req, res) => {
      /*
          #swagger.tags = ["Comments"]
          #swagger.summary = "Update Comment"
          #swagger.parameters['body'] = {
              in: 'body',
              required: true,
              schema: {
                  content: 'Test Comment'
              }
          }
      */
      const data = await BlogComment.updateOne(
        { _id: req.params.commentId },
        req.body
      );
      const newData = await BlogComment.find({
        _id: req.params.commentId,
      }).populate([
        { path: "author", select: "email" },
        { path: "post", select: "title" },
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
          #swagger.tags = ["Comments"]
          #swagger.summary = "Delete Comment"
      */
      try {
        // ? when a comment deleted, it also deletes the comment on the releated post
        const data = await BlogComment.deleteOne({ _id: req.params.commentId });
        const post = await BlogPost.findOne({ comments: req.params.commentId });
        if (post) {
          post.comments.pull(req.params.commentId);
          await post.save();
        }
        res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
      } catch (error) {
        res.status(500).send({
          error: true,
          message: error.message,
        });
      }
    },
  };