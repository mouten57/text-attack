const keys = require('../config/keys/keys');
const sendSms = require('../helpers/twilio');
const factQueries = require('../db/factQueries.js');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const phonebook = require('../client/src/phonebook')
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
                        to: 'awalker@solutionzinc.com',
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
                    factQueries.send(global_message, (err, send) => {
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
              factQueries.send(global_message, (err, send) => {
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
      factQueries.send(global_message, (err, send) => {
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
    const email_to_send = {
      to: 'outenmp@gmail.com',
      from: 'ckn0rr1ss@gmail.com',
      subject: 'A NEW REPLY!!',
      text: fact,
      html: `<strong>${body} from ${req.body.From}</strong>`,
    };
      sgMail.send(email_to_send).then(() => {
        factQueries.reply(req.body, (err, reply) => {
          try {
            let reply;
            switch (body){
              case "hello": 
              reply = "Hi!"
              break;
              case 'bye': 
              reply = "Goodbye!"
              break;
              default: 
              reply = 'LOL'
            }
            twiml.message(reply)
            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end(twiml.toString());
          } catch (err) {
            console.log(err)
          }
        });  
    }).catch((error) => {
        console.log(error.response.body)
    })

  },
  reset(req, res, next) {
    factQueries.resetTheCount((err, count) => {
      if (err) throw err;
      res.send(count);
    });
  },
};