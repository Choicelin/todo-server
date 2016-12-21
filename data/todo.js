var mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
  content: String,
  completed: Boolean
});

module.exports = mongoose.model('Todo',todoSchema);;