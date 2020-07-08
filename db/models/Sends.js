const mongoose = require('mongoose');
const { Schema } = mongoose;

const sendSchema = new Schema({
  body: String,
  from: String,
  fromName: String,
  to: String,
  toName: String,
  dateCreated: Date,
});

mongoose.model('send', sendSchema);
