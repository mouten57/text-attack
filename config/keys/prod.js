//prod.js - production keys here!!

module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  redirectDomain: process.env.REDIRECT_DOMAIN,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  TWILIO_PHONE_NUMBER_2: process.env.TWILIO_PHONE_NUMBER_2,
  TWILIO_PHONE_NUMBER_3: process.env.TWILIO_PHONE_NUMBER_3,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
};
