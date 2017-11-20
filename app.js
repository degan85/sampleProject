var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var OrientoStore = require('connect-oriento')(session);
var db_config = require('./config/db-config.json');
var passport = require('./config/passport')(app);

app.use(session({
    secret: 'aeoifja12312!@#%@#akuheas',
    resave: false,
    saveUninitialized: true,
    store: new OrientoStore({server: db_config})
    // cookie: { secure: true }
}));

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var auth = require('./routes/auth')(passport);
var topic = require('./routes/topic')();
var index = require('./routes/index');
var users = require('./routes/users');

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

app.use('/', index);
app.use('/users', users);
app.use('/topic', topic);
app.use('/auth', auth);

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
