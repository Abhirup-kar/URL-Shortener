const express = require('express');
const urlController = require('../controllers/urlController.js');

const urlRouter = express.Router();

urlRouter.use(urlController);

module.exports = urlRouter;
