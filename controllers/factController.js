const config = require('../config/keys/keys');
const sendSms = require('../helpers/twilio');
const factQueries = require('../db/factQueries.js');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = {
  get(req, res, next) {
    factQueries.getTheCount((err, count) => {
      if (err) throw err;
      res.send(count);
    });
  },
  send(req, res, next) {
    const { phone, fact } = req.body;
    sendSms(phone, fact, (err, msg) => {
      if (err) throw err;
      factQueries.send(msg, (err, send) => {
        if (err) throw err;
        res.send(msg);
      });
    });
  },
  reply(req, res, next) {
    const twiml = new MessagingResponse();
    const body = req.body.Body.toLowerCase();
    console.log(req.body);
    factQueries.reply(req.body, (err, reply) => {
      try {
        if (body == 'hello') {
          twiml.message('Hi!');
        } else if (body == 'stop') {
          twiml.message('LOL.');
        } else if (body == 'help') {
          twiml.message('THERE IS NO HELP.');
        } else if (body == 'bye') {
          twiml.message('Goodbye');
        } else {
          twiml.message('Reply "HELP" to see all available options');
        }
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      } catch (err) {
        throw err;
      }
    });
  },
};
