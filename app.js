const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const passport = require('passport');
// const authenticate = require('./authenticate');
const config = require('./config');
// const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRouter');
const campsiteRouter = require('./routes/campsiteRouter'); 
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const url = config.mongoUrl;
//Connect to database
mongoose.connect(url).then(()=>{
    console.log('connection to database successfully established');
  }
).catch(err=> console.log(err)); 

const app = express();
// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});
// app.use(cookieParser('12345-67890-09876-54321'));
app.set('view engine', 'jade');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(session({
//   name: 'session-id',
//     secret: '12345-67890-09876-54321',
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore()
// }));
app.use(passport.initialize());
// app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
//Implement basic authentication:
// const auth = (req, res, next)=>{
//   console.log(req.user);
//   if (!req.user) {
//       const err = new Error('You are not authenticated!');                    
//       err.status = 401;
//       return next(err);
//   } else {
//       return next();
//   }
// }

// app.use(cookieParser());
// app.use(auth); //use authentication
app.use(express.static(path.join(__dirname, 'public')));
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
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
