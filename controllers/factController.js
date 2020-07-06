const config = require('../config/keys/keys');
const sendSms = require('../helpers/twilio');
const factQueries = require('../db/factQueries.js');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = {
  get(req, res, next) {
    let factData = [];
    factQueries.getTheCount((err, count) => {
      if (err) throw err;
      console.log(count);
      res.send(count);
    });
  },
  send(req, res, next) {
    const { phone, fact } = req.body;
    console.log(phone, fact);
    sendSms(phone, fact);
  },
  reply(req, res, next) {
    const twiml = new MessagingResponse();
    const body = req.body.Body.toLowerCase();
    if (body == 'hello') {
      twiml.message('Hi!');
    } else if (body == 'help') {
      twiml.message('THERE IS NO HELP.');
    } else if (body == 'bye') {
      twiml.message('Goodbye');
    } else {
      twiml.message('Reply "HELP" to see all available options');
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  },
};
