"use strict";
/* -------------------------------------------------------
    EXPRESS - Blog API Documentation
------------------------------------------------------- */
require("dotenv").config();
const HOST = process.env?.HOST || "127.0.0.1";
const PORT = process.env?.PORT || 8000;
// npm i swagger-autogen

const swaggerAutogen = require("swagger-autogen")();
const packageJson = require("./package.json");

const {BlogPost,BlogComment,BlogCategory} = require("./src/models/blog")
const document = {
    // ? document infos
  info: {
    version: packageJson.version,
    title: packageJson.title,
    description: packageJson.description,
    contact: {
      name: packageJson.author,
      email: "vcetin1356@gmail.com",
    },
    license: { name: packageJson.license },
  },
  host: `${HOST}:${PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  securityDefinitions: {
    Token: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Simple Token Authentication * Example: <b>Token ...tokenKey...</b>",
    },
  },
  security: [{ Token: [] }], //? Use token for security
  //   ? Models are defined
  definitions: {
    "auth/login": {
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    "/auth/refresh": {
      "token.refresh": {
        description: "{ token: { refresh: ... } }",
        type: "String",
        required: true,
      },
    },
    "User": require("./src/models/user").schema.obj,
    "BlogPost": BlogPost.schema.obj,
    "BlogCategory": BlogCategory.schema.obj,
    "BlogComment": BlogPost.schema.obj,
  },
};

const routes = ["./index.js"]; //? find routes in main directory
const outputFile = "./swagger.json"; //? save the output file

swaggerAutogen(outputFile, routes, document);
