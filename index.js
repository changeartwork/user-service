require('dotenv').config();
const express = require('express');
const userRoute = require('./routes/endpoints');
const profile = require('./routes/profile');
const registerClient = require('./routes/register-client');
const loginClient = require('./routes/login-client');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./spec/swagger.json');
const customCss = fs.readFileSync((process.cwd()+"/spec/swagger.css"), 'utf8');
const cors = require('cors');
require('./config/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/v1/api/user',userRoute, profile, registerClient, loginClient);
app.use(cors());
app.use('/v1/api/user/spec', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

app.listen(`${process.env.APP_PORT}`, () => {
  console.log('user-service started on port '+ `${process.env.APP_PORT}`);
});
