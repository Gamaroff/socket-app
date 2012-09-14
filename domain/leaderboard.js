/**
 * LeaderBoard: gamaroff
 * Date: 2012/08/16
 * Time: 10:20 AM
 */

var mongoose = require('mongoose');

function LeaderBoard() {

    var self = this;

    var mongoDb;

    var leaderboardSchema = new mongoose.Schema({
        player:String,
        email:String,
        game_id:String,
        game_description:String,
        duration:Number,
        score:Number,
        date:Date,
        players:Number
    });

    self.init = function (db) {
        mongoDb = db;
    };

    self.save = function (obj, callback) {

        var LeaderBoard = mongoDb.model('LeaderBoard', leaderboardSchema);

        var newLeaderBoard = new LeaderBoard(
            {
                player:obj.player,
                game_id:obj.game_id,
                game_description:obj.game_description,
                duration:obj.duration,
                score:obj.score,
                date:new Date(),
                players:obj.players
            });

        newLeaderBoard.save(function (err, result) {
            if (err)
                callback(err);
            else {
                callback(null, result);
            }
        });
    };

    self.getLeaderboard = function (gameId, duration, players, callback) {

        var LeaderBoard = mongoDb.model('LeaderBoard', leaderboardSchema);

        LeaderBoard.find({
            game_id:parseInt(gameId, 10), duration:parseInt(duration, 10), players:parseInt(players, 10)
        }).sort('-score').execFind(function (err, result) {

                if (err) {
                    return callback('LeaderBoard for that game does not exist');
                } else {

                    return callback(null, result);
                }
            });
    };

}

module.exports = new LeaderBoard();
