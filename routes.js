/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 10:15 AM
 */
var passport = require('passport');
var auth = require('./auth');

var home = require('./routes/homeRoutes');
var account = require('./routes/accountRoutes');
var register = require('./routes/registerRoutes');
var games = require('./routes/gameRoutes');
var process = require('./routes/processRoutes');

function Routes() {
    'use strict';

    var self = this;

    self.init = function (app) {

        //region Home

        app.get('/', home.viewIndex);

        //endregion

        //region Game

        app.get('/account', auth.ensureAuthenticated, account.view);
        app.post('/account', auth.ensureAuthenticated, account.update);

        app.get('/game', auth.ensureAuthenticated, games.viewGame);
        app.get('/api/games', games.getAll);
        app.get('/api/games/:id', auth.ensureAuthenticated, games.getQuestions);

        app.post('/api/leaderboard', auth.ensureAuthenticated, games.saveScore);
        app.get('/leaderboard', games.viewLeaderboard);
        app.get('/api/leaderboard/:gameId/:duration/:players', games.getLeaderboard);

        //endregion

        //region Account

        app.get('/registered', register.viewRegistered);
        app.get('/register', register.view);
        app.post('/register', register.save);

        app.get('/login', account.viewLogin);

        app.post('/login', function (req, res, next) {
            passport.authenticate('local', function (err, user, info) {
                if (err || !user) {
                    res.send({err:info.message});
                }
                else {
                    req.logIn(user, function (err) {
                        if (err) {
                            res.send({err:err});
                        }
                        else
                            res.send({result:true});
                    });
                }
            })(req, res, next);
        });

        app.get('/logout', account.logout);

        //endregion

        //region Process

        app.get('/process', process.process);

        //endregion
    };

}

module.exports = new Routes();
