const express = require('express');
const Client = require('../model/client');
const Router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

Router.post(
  '/register-client',
  async (req, res) => {
    try {
      const { client_id, profile, password, business_name, phone_number, payment_mode, payment_terms_in_days, currency_code, state, city, country, zipcode } = req.body;
      if (client_id == null || password == null) {
        res.status(400).send({ message: "Check the manditory fields." });
      }
      const oldClient = await Client.findOne({ client_id });
      if (oldClient) {
        return res.status(409).send({ message: "Client already exist. Please Login" });
      }
      encryptedPassword = await bcrypt.hash(password, 10);
      const client = new Client({
        client_id,
        profile,
        business_name,
        phone_number,
        payment_terms_in_days,
        currency_code,
        city,
        state,
        country,
        payment_mode,
        zipcode,
        password: encryptedPassword
      });

      client.save((err, client) => {
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
              message: "Client " + client.client_id + " registered successfully"
            })
        }
      });
    } catch (err) {
      res.status(500)
        .send({
          message: "Something went wrong",
          error: err.message
        });
    }
  });

module.exports = Router;
