const path = require('path');
const express = require('express');
const User = require('../model/user');
const Router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

Router.post(
  '/register', 
  async (req, res) => {
    try{
      const { name, role, email, password } = req.body;
      if (!(email && password && name)) {
        res.status(400).send({message:"All fields are required"});
      }
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        return res.status(409).send({message: "User already Exist. Please Login"});
      }
      encryptedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        role,
        email: email.toLowerCase(),
        password: encryptedPassword
      });
    
      user.save((err, user) => {
        if (err) {
          res.status(500)
            .send({
              message: "Something went wrong",
              error: err.message
            });
          return;
        } else {
          res.status(200)
            .send({
              message: "User Registered successfully"
            })
        }
      });
    }catch (err) {
      res.status(500)
            .send({
              message: "Something went wrong",
              error: err.message
            });
    }
});

Router.post('/login', 
  async (req, res) => {
    User.findOne({
      email: req.body.email
    })
    .exec((err, user) => {
      if (err) {
        res.status(500)
          .send({
            message: err
          });
        return;
      }
      if (!user) {
        return res.status(404)
          .send({
            message: "User Not found."
          });
      }

      //comparing passwords
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // checking if password was valid and send response accordingly
      if (!passwordIsValid) {
        return res.status(401)
          .send({
            accessToken: null,
            message: "Invalid Password!"
          });
      }

      // Authorization validation
      if(req.body.role != user.role){
        return res.status(401)
        .send({
          accessToken: null,
          message: "Unauthorized Access!"
        });
      }
      //signing token with user id
      var token = jwt.sign({
        id: user.id
      }, process.env.TOKEN_KEY, {
        expiresIn: '1h'
      });

      //responding to client request with user profile success message and  access token .
      res.status(200)
        .send({
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          message: "Login successfull",
          accessToken: token,
        });
    });
});

module.exports = Router;
