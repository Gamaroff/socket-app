/**
 * User: gamaroff
 * Date: 2012/08/22
 * Time: 4:04 PM
 */
var mongoose = require('mongoose');
var user = require('./user');
var leaderboard = require('./leaderboard');

function Mongo() {

    var self = this;

    self.init = function () {
        var db = mongoose.createConnection('localhost', 'SocketGame');

        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log('Connected to Mongo');
            user.init(db);
            leaderboard.init(db);
        });

    };

}

module.exports = new Mongo();
