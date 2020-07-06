const mongoose = require('mongoose');
const { Schema } = mongoose;

const countSchema = new Schema({
  page: Number,
  item: Number,
  created_at: Date,
});

mongoose.model('count', countSchema);
