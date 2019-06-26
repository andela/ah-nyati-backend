"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cors = _interopRequireDefault(require("cors"));

var _errorhandler = _interopRequireDefault(require("errorhandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import mongoose from 'mongoose';
var isProduction = process.env.NODE_ENV === "production"; // Create global app object

var app = (0, _express["default"])();
app.use((0, _cors["default"])()); // Normal express config defaults

app.use(require("morgan")("dev"));
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use(require("method-override")());
app.use(_express["default"]["static"](__dirname + "/public"));
app.use((0, _expressSession["default"])({
  secret: "authorshaven",
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));

if (!isProduction) {
  app.use((0, _errorhandler["default"])());
} // if (isProduction) {
//     mongoose.connect(process.env.MONGODB_URI);
// } else {
//     mongoose.connect("mongodb://localhost/conduit");
//     mongoose.set("debug", true);
// }
// require("./models/User");
// app.use(require("./routes"));


app.get('/', function (req, res) {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Author\'s Haven'
  });
}); /// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
}); /// error handlers
// development error handler
// will print stacktrace

if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
} // production error handler
// no stacktraces leaked to user


app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
}); // finally, let's start our server...

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + server.address().port);
});
var _default = server;
exports["default"] = _default;