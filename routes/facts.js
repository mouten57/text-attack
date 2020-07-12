const factController = require('../controllers/factController');

module.exports = (app) => {
  app.get('/api/fact', factController.get);
  app.post('/api/send', factController.send);
  app.post('/api/reply', factController.reply);
  app.get('/api/reset', factController.reset);
  app.post('/api/get_convo_history', factController.getConvoHistory);
};
