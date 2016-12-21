var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');
var cors = require('cors');
var Todo = require('./data/todo');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', index);
app.use('/users', users);
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/todo');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("连接成功");
});

app.get('/start',function(req,res,next){
  Todo.find({},function(error,docs){
    res.json(docs);
  });
});

app.post('/save',function(req,res,next){
  console.log(req.body);
  var todoData = new Todo(req.body);
  todoData.save(function(err, data){
    if(err){
      console.log(err);
    } else {
      return res.json({err: 0});
      console.log('需要的数据'+data);
    }
  })
});

app.post('/update',function(req,res,next){
  var conditions = {_id: req.body['updateData[0][_id]']};
  var update = {content: req.body['updateData[1][content]']};
  Todo.update(conditions, update, function(err){
    if(err){
      console.log(err);
    }else{
      return res.json({});
      console.log('update success');
    }
  });
});

app.post('/delete', function(req,res,next){
  var conditions = {_id: req.body.delete};
  Todo.remove(conditions, function(err){
    if(err){
      console.log(err);
    }else{
      return res.json({});
      console.log('删除成功');
    }
  });
});

app.post('/updateCompleted',function(req,res,next){
  var conditions = {_id: req.body['updateData[0][_id]']};
  var update = {completed: req.body['updateData[1][completed]']};
  Todo.update(conditions, update, function(err){
    if(err){
      console.log(err);
    }else{
      return res.json({});
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
