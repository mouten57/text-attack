const keys = require('../config/keys/keys');
const sendSms = require('../helpers/twilio');
const factQueries = require('../db/factQueries.js');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const phonebook = require('../client/src/phonebook')
const getNameFromNumber = require('../helpers/getNameFromNumber')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(keys.SENDGRID_API_KEY);

module.exports = {
  get(req, res, next) {
    factQueries.getTheCount((err, count) => {
      if (err) throw err;
      res.send(count);
    });
  },
  send(req, res, next) {
    const { phone, fact } = req.body;
    const global_message = {
      body: fact,
      from: keys.TWILIO_PHONE_NUMBER,
      to: phone,
      dateCreated: Date.now(),
    }
    sendSms(count=1, phone, fact, (err, msg) => {
      if (err){
        if (err.message.includes('blacklist rule')){
          sendSms(count=2, phone, fact, (err, msg)=> {
            if (err){
              console.log(err.message)
              if (err.message.includes('blacklist rule')){
                sendSms(count=3, phone, fact, (err, msg)=> { 
                  if (err){
                    console.log(err.message)
                    if (err.message.includes('blacklist rule')) {
                      const email_to_send = {
                        to: 'outenmp@gmail.com',
                        from: 'ckn0rr1ss@gmail.com',
                        subject: 'Chuck Norris Fact',
                        text: fact,
                        html: `<strong>${fact}</strong>`,
                      };
                        sgMail.send(email_to_send).then(() => {
                          console.log('Message sent')
                          global_message.type = 'Email'
                          factQueries.send(global_message, (err, query_save) => {
                            if (err){
                              console.log(err);
                            }else{
                              res.send(query_save);
                            }    
                          });  
                      }).catch((error) => {
                          console.log(error.response.body)
                      })
                    }
                  } else {
                    global_message.type = 'Text';
                    factQueries.send(msg, (err, send) => {
                      if (err){
                        console.log(err);
      
                      }else{
                        res.send(msg);
                      }    
                    }); 
                  }
                })
              }
            } else {
              global_message.type = 'Text';
              factQueries.send(msg, (err, send) => {
                if (err){
                  console.log(err);

                }else{
                  res.send(msg);
                }    
              }); 
            }
          })

        } else {
        console.log(err.message)
        }
      }else{
        global_message.type = 'Text'
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