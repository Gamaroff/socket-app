/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , passport = require('passport')
    , auth = require('./auth')
    , game = require('./game')
    , mongo = require('./domain/mongo');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('sessionsecret'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

routes.init(app);

game.init(server);

mongo.init();


