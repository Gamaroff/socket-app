/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 8:23 PM
 */

var gameModel = require('../domain/game')
var leaderboardModel = require('../domain/leaderboard');

function GameRoutes() {

    var self = this;

    // app.get('/game'
    self.viewGame = function (req, res) {
        res.render('game.jade', {
            title:'Socket Game',
            currentUser:req.user
        });
    };

    // app.get('/game'
    self.viewLeaderboard = function (req, res) {

        res.render('leaderboard.jade', {
            title:'Socket Game',
            currentUser:req.user
        });

    };

    // app.get('/api/games'
    self.getAll = function (req, res) {
        gameModel.getAll(function (result) {
            res.json({result:result});
        });
    };

    // app.get('/api/games/:id'
    self.getQuestions = function (req, res) {
        gameModel.getQuestions(req.params.id, function (result) {
            res.json({result:result});
        });
    };

    // app.get('/api/leaderboard/:id'
    self.getLeaderboard = function (req, res) {
        leaderboardModel.getLeaderboard(req.params.gameId, req.params.duration, req.params.players, function (err, result) {
            res.json({result:result});
        });
    };

    // app.post('/api/leaderboard'
    self.saveScore = function (req, res) {

        var player = req.user.first_name + ' ' + req.user.last_name;
        req.body.player = player;

        leaderboardModel.save(req.body, function (err, result) {
            res.json({err:err, result:result});
        });
    };

}

module.exports = new GameRoutes();