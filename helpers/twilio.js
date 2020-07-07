const keys = require('../config/keys/keys');
const accountSid = keys.TWILIO_ACCOUNT_SID;
const authToken = keys.TWILIO_AUTH_TOKEN;

const sendSms = (phone, message, callback) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: message,
      from: keys.TWILIO_PHONE_NUMBER,
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
