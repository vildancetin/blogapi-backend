"use strict";
/* ====================================================== */
/*                     BLOG API CONTROLLERS               */
/* ====================================================== */

require("express-async-errors");
const User = require("../models/user");

// CRUD + list operations for user
module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
             #swagger.summary = "List Users"
        #swagger.description = `
            You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
        */
    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },
  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                 email:"example@example.com,
        password:"Example123?",
        firstName:"Example",
        lastName:"Example"
            }
        }
        */
    const data = await User.create(req.body);
    res.status(201).send({
      error: false,
      body: req.body,
      data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Get Single User"
        
    */
    const data = await User.find({ _id: req.params.userId });
    res.status(202).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                 
        lastName:"Example updated"
            }
        }
        */
    // ? runValidators -> Validates the incoming email expression when update according to the required data.
    const data = await User.updateOne({ _id: req.params.userId }, req.body, {
      runValidators: true,
    });
    const newData = await User.find({ _id: req.params.userId });
    res.status(202).send({
      error: false,
      body: req.body,
      data,
      newData,
    });
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"

        */
    const data = await User.deleteOne({ _id: req.params.userId });
    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
