const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter'); 
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const url = 'mongodb://localhost:27017/nucampsite';

const app = express();
//Connect to database
mongoose.connect(url).then(()=>{
    console.log('connection to database successfully established');
  }
).catch(err=> console.log(err)); 
app.use(cookieParser('12345-67890-09876-54321'));
//Implement basic authentication:
const auth = (req, res, next)=>{
    // console.log(req.headers);
    const authHeader = req.headers.authorization;
    if(!req.signedCookies.user){
        if(!authHeader){
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
        }
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); //split the username and password into two in an array.
          const user = auth[0];
          const pass = auth[1];
        if (user === 'admin' && pass === 'password') {
          res.cookie('user', 'admin', {signed: true});
            return next(); // authorized
        }
        else{
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
        }
      }
      else {
        if(req.signedCookies.user === 'admin'){
          return next(); // authorized
        }
        else {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');      
          err.status = 401;
          return next(err);
        }
    }
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth); //use authentication
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
