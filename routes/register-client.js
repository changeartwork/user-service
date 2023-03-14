const express = require('express');
const Client = require('../model/client');
const Router = express.Router();
const Cryptr = require('cryptr');
const cryptr = new Cryptr('change');

Router.post(
  '/register-client',
  async (req, res) => {
    try {
      const { profile, password, business_name, phone_number, cell_number, payment_mode, payment_terms_in_days, currency_code, state, city, country, zipcode } = req.body;
      if (password == null) {
        res.status(400).send({ message: "Check the manditory fields." });
      }
      encryptedPassword = cryptr.encrypt(password);
      const client = new Client({
        profile,
        business_name,
        phone_number,
        cell_number,
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
          res.status(400)
            .send({
              message: "Something went wrong",
              error: err.message
            });
          return;
        } else {
          res.status(200)
            .send({
              message: "Client ID " + client.client_id + " registered successfully"
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
