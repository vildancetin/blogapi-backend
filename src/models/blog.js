"use strict";
/*
    BLOG API MODELS
*/
const {mongoose} = require("../configs/dbConnection")

// Blog Post Model
const BlogPostSchema = new mongoose.Schema(
  {
    blogCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "BlogComment",
        trim: true,
      },
    ],
  },
  {
    collection: "blogPost",
    timestamps: true,
  }
);
// Blog Category Model
const BlogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPost",
      },
    ],
  },
  {
    collection: "blogCategory",
    timestamps: true,
  }
);

const BlogCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
    },
  },
  {
    collection: "comment",
    timestamps: true,
  }
);
module.exports = {
  BlogCategory: mongoose.model("BlogCategory", BlogCategorySchema),
  BlogPost: mongoose.model("BlogPost", BlogPostSchema),
  BlogComment: mongoose.model("BlogComment", BlogCommentSchema),
};
