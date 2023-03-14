const express = require('express');
const Client = require('../model/client');
const Router = express.Router();
const jwt = require("jsonwebtoken");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('change');

Router.post('/login-client',
  async (req, res) => {
    Client.findOne({
      client_id: req.body.client_id
    })
      .exec((err, client) => {
        if (err) {
          res.status(500)
            .send({
              message: err
            });
          return;
        }
        if (!client) {
          return res.status(404)
            .send({
              message: "Client not found for "+ req.body.client_id
            });
        }

        //comparing passwords
        var passwordDecrypted = cryptr.decrypt(client.password);
        // checking if password was valid and send response accordingly
        if (req.body.password != passwordDecrypted) {
          return res.status(401)
            .send({
              message: "Invalid Password"
            });
        }

        // Authorization validation
        if (req.body.role != client.role) {
          return res.status(401)
            .send({
              message: "Unauthorized Access"
            });
        }

        // User validation
        currentProfile = client.profile.filter( i  => req.body.email === i.email)
          if(currentProfile.length == 0)
          return res.status(404)
          .send({
            message: "User profile not found for "+ req.body.email
          });
            
        //signing token with client id
        var token = jwt.sign({
          client_id: client.client_id,
          role: client.role,
          profile: req.body.email
        }, process.env.TOKEN_KEY, {
          expiresIn: '1h'
        });

        //filter only the logged client profile

        var filterClient = (profile, email) => {
          currentProfile = profile.filter( i  => email === i.email)
          if(currentProfile.length > 0)
            return currentProfile[0];
        }


        //responding to client request with client profile success message and  access token .
        res.status(200)
          .send({
            client: {
              client_id: client.client_id,
              status: client.client_status,
              profile: filterClient(client.profile, req.body.email)
            },
            message: "Login successfull",
            accessToken: token,
          });
      });
  });

module.exports = Router;
