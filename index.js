const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fs = require("fs"),
    http = require("http"),
    path = require("path"),
    methods = require("methods"),
    express = require("express"),
    bodyParser = require("body-parser"),
    session = require("express-session"),
    cors = require("cors"),
    passport = require("passport"),
    errorhandler = require("errorhandler"),
    mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

const options = {
   definition: {
     openapi: '3.0.0',
     info: {
       title: 'Authors Haven', 
       version: '1.0.0', 
       description: 'Endpoints for Authors Haven'
     },
     securityDefinitions: {
       bearerAuth: {
         type: 'apiKey',
         name: 'Authorization',
         scheme: 'bearer',
         in: 'header',
       },
   },
},
   apis: ['./routes/api/*.js'],
};
 const swaggerSpec = swaggerJSDoc(options);

 app.get('/api-docs.json', (req, res) => {
   res.setHeader('Content-Type', 'application/json');
   res.send(swaggerSpec);
 });

 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("method-override")());
app.use(express.static(__dirname + "/public"));

app.use(
    session({
        secret: "authorshaven",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
);

if (!isProduction) {
    app.use(errorhandler());
}

if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect("mongodb://localhost/conduit");
    mongoose.set("debug", true);
}

require("./models/User");

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {}
        }
    });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + server.address().port);
});
