const mongoose = require('mongoose');
const { Schema } = mongoose;

const factSchema = new Schema({
  page: Number,
  created_at: Date,
  list: Array,
});

mongoose.model('facts', factSchema);
