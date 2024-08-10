"use strict";
/* -------------------------------------------------------
    BLOG API PROJECT WITH MONGOOSE
------------------------------------------------------- */
const express = require("express");
const app = express();

// env configs
require("dotenv").config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// db connection import
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/** DOCUMMENTATION */
// ? Json
app.use("/documents/json", (req, res) => {
  res.sendFile("swagger.json", { root: "." });
});

// ? Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
app.use(
  "/documents/swagger",
  swaggerUi.serve,  //? start the system
  swaggerUi.setup(swaggerJson, {  //? import the json file and configure the token 
    swaggerOptions: { persistAuthorization: true },
  })
);
// ? Redoc
const redoc= require("redoc-express")
app.use("/documents/redoc",
  redoc({
    title:"Blog API",
    specUrl:"/documents/json"
  })
)
/* MIDDLEWARES */

// to json
app.use(express.json());
// logging
app.use(require("./src/middlewares/logging"));

app.use(require("./src/middlewares/authentication"));

app.use(require("./src/middlewares/findSearchSortPage"));

app.use(require("./src/routes/index"));
/* Routes */
app.all("/", (req, res) => {
  res.send({
    error: false,
    message: "WELCOME BLOG API PROJECT",
    user: req.user,
  });
});
// error-handler
app.use(require("./src/middlewares/errorHandler"));

app.listen(PORT, () => console.log(`Server Running on http://${HOST}:${PORT}`));
