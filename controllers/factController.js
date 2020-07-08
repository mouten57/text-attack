const config = require('../config/keys/keys');
const sendSms = require('../helpers/twilio');
const factQueries = require('../db/factQueries.js');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const phonebook = require('../client/src/phonebook')
const getNameFromNumber = require('../helpers/getNameFromNumber')

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
      if (err){console.log(err)
      }else{
      factQueries.send(msg, (err, send) => {
        if (err){
          console.log(err);
        }else{
        res.send(msg);
        }    
      });  
    }  
    });
  },
  reply(req, res, next) {
    const twiml = new MessagingResponse();
    const body = req.body.Body.toLowerCase();
    console.log(req.body);
    factQueries.reply(req.body, (err, reply) => {
      try {
        switch (body){
          case "hello": twiml.message('Hi!');
          case 'stop': twiml.message('LOL.');
          case 'help': twiml.message('THERE IS NO HELP.');
          case 'bye': twiml.message('Goodbye');
          default: twiml.message('Reply "HELP" to see all available options');
        }
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      } catch (err) {
        console.log(err)
      }
    });
  },
};
