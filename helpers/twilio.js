const keys = require('../config/keys/keys');
const accountSid = keys.TWILIO_ACCOUNT_SID;
const authToken = keys.TWILIO_AUTH_TOKEN;

const sendSms = (count, phone, message, callback) => {
  if(count == 1){
    var twilioPhoneNumber = keys.TWILIO_PHONE_NUMBER 
  }else if (count == 2){
    var twilioPhoneNumber = keys.TWILIO_PHONE_NUMBER_2 
  }else{
    var twilioPhoneNumber = keys.TWILIO_PHONE_NUMBER_3
  }
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: phone,
    })
    .then((message) => {
      callback(null, message);
    })
    .catch((err) => {
      callback(err);
    });
};

module.exports = sendSms;
