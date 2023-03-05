const express = require('express');
const Client = require('../model/client');
const Router = express.Router();
const auth = require("../middleware/auth");

Router.get('/profile', auth, async (req, res) => {
  try {
    const email = req.client.profile;
    if(email == null)
      res.status(400)
      .send({message: 'Profile email is missing.'})
    const profile = email ? await Client.find({profile: {$elemMatch: {email: email}}},{"profile.$":1}) : await Client.find({});
    if(profile==null)
      res.status(400)
      .send({message: 'No profile matched for the given email'})
    else
      res.send(profile[0].profile[0]);
  } catch (error) {
    res.status(500)
      .send(
        {
          message: 'Error while getting the profile.',
          error: error.message
        });
  }
});


module.exports = Router;
