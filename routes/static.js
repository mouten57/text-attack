const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController');

module.exports = (app) => {
  app.get('/api/hello', staticController.call);
  app.post('/api/world', staticController.response);

  app.get('/about', staticController.about);
};
