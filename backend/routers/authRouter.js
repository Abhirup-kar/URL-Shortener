const express = require('express');
const authController = require('../controllers/authController.js');

const authRouter = express.Router();

authRouter.use(authController);

module.exports = authRouter;
