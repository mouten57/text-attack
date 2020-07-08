const mongoose = require('mongoose');
const { Schema } = mongoose;

const replySchema = new Schema({
  Body: String,
  From: String,
  fromName: String,
  To: String,
  toName: String,
  dateCreated: Date,
});

mongoose.model('reply', replySchema);
