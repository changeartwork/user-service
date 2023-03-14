const express = require('express');
const Client = require('../model/client');
const Router = express.Router();
const axios = require('axios');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('change');


Router.post('/forgot-password', async (req, res) => {
  try {
    const email = req.body.email;
    if (email == null)
      res.status(400)
        .send({ message: 'User email is missing.' })
    const client = email ? await Client.find({ profile: { $elemMatch: { email: email } } }) : await Client.find({});
    if (client == null)
      res.status(400)
        .send({ message: 'No client matched for the given email' })
    // Enable this later
    // else if (client[0].client_status === 'INACTIVE') {
    //   res.status(400)
    //   .send({ message: 'Your account is INACTIVE, kindly check with admin.' })
    // }
    else
    axios({
      method: "post",
      url: `${process.env.NS_API}/send-mail`,
      data: {
        "email": req.body.email,
        "subject": "Forgot Password ?",
        "template_id": "forgot-password",
        "client": {
          "client_id": client[0].client_id,
          "email": req.body.email,
          "password": cryptr.decrypt(client[0].password)
        }
      }
    })
      .then(function (response) {
        res.status(200).send({
          "message": "Password has been sent to "+ req.body.email
        })
      })
      .catch(function (response) {
        res.status(500).send({"error": "Unable to send the password to the email id."})
      });
  } catch (error) {
    res.status(500)
      .send(
        {
          message: 'Error while getting the client details.',
          error: error.message
        });
  }
});

module.exports = Router;
