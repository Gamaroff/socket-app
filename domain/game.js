/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 8:09 PM
 */
var _ = require('underscore');
var fs = require('fs');

function Game() {
    'use strict';

    var self = this;

    var games = [
        {id:1, name:'Geography', file:'Geography.json'},
        {id:2, name:'History', file:'questions.1'}
    ];

    self.get = function (id, callback) {
        callback(null, games[0]);
    };

    self.getAll = function (callback) {
        callback(games);
    };

    self.getGame = function (gameId, callback) {
        var game = _.find(games, function (g) {
            return g.id === gameId;
        });

        if (game) {
            callback(null, game);
        }
        else {
            callback('No game');
        }
    };

    self.getQuestions = function (gameId, callback) {

        var game = _.find(games, function (g) {
            return g.id === gameId;
        });

        fs.readFile('./json/newfiles/' + game.file, function (err, data) {

            var gameData = JSON.parse(data.toString());

            callback(gameData.gameQuestions);
        });

    };

    self.getQuestion = function (gameId, id, callback) {

        var game = _.find(games, function (g) {
            return g.id === gameId;
        });

        fs.readFile('./json/newfiles/' + game.file, function (err, data) {

            var gameData = JSON.parse(data.toString());

            var question = _.find(gameData.gameQuestions, function (question) {
                return question.id === parseInt(id, 10);
            });

            callback(question);

        });
    };

}

module.exports = new Game();