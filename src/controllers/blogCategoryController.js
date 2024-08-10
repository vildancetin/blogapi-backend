"use strict";
/* ====================================================== */
/*                     BLOG API CONTROLLERS               */
/* ====================================================== */

// to catch if be able to async errors
require("express-async-errors");
const { BlogCategory, BlogPost } = require("../models/blog");
const User = require("../models/user");
// ? CRUD + list operations for category and post
// ? getModelList is a function that take an argument as a Model and return sorted,filtered,searched,limited data
// ? getModelListDetails return data details
module.exports.BlogCategory = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Blog Categories"]
        #swagger.summary = "List Categories"
        #swagger.description = `
            You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
    */
    const data = await res.getModelList(BlogCategory, {}, [
      { path: "posts", select: "title" },
    ]);
    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(BlogCategory),
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Blog Categories"]
        #swagger.summary = "Create Categories"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: 'Test Category'
            }
        }
    */
    const data = await BlogCategory.create(req.body);
    res.status(201).send({
      error: false,
      body: req.body,
      data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Blog Categories"]
        #swagger.summary = "Get Single Category"
        
    */
    const data = await BlogCategory.find({
      _id: req.params.categoryId,
    }).populate({ path: "posts", select: "title" });
    res.status(202).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Blog Categories"]
        #swagger.summary = "Update Category"
         #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: 'Test Category'
            }
        }
        
    */
    const data = await BlogCategory.updateOne(
      { _id: req.params.categoryId },
      req.body
    );
    const newData = await BlogCategory.find({
      _id: req.params.categoryId,
    }).populate({ path: "posts", select: "title" });
    res.status(202).send({
      error: false,
      body: req.body,
      data,
      newData,
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Blog Categories"]
        #swagger.summary = "Delete Category"
        
    */
    const data = await BlogCategory.deleteOne({ _id: req.params.categoryId });
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
  // ? it returns filtered "post data" by category
  posts: async (req, res) => {
    /*
        #swagger.tags = ["Blog Categories"]
        #swagger.summary = "Posts of Category"
    */
    const data = await res.getModelList(
      BlogPost,
      { blogCategoryId: req.params.categoryId },
      { path: "blogCategoryId", select: "name" }
    );
    res.status(200).send({
      error: false,
      detail: await res.getModelListDetails(BlogPost),
      data,
    });
  },
};


