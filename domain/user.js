/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 10:20 AM
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

function User() {

    var self = this;

    var mongoDb;

    var userSchema = new mongoose.Schema({
        first_name:String,
        last_name:String,
        email:String,
        salt:String,
        hash:String
    });

    self.init = function (db) {
        mongoDb = db;
    };

    self.save = function (obj, callback) {

        var User = mongoDb.model('User', userSchema);

        User.findOne({
            email:obj.email
        }, function (err, result) {

            // user doesn't exist
            if (!result) {

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(obj.password, salt);

                var newUser = new User(
                    {
                        first_name:obj.first_name,
                        last_name:obj.last_name,
                        email:obj.email,
                        salt:salt,
                        hash:hash
                    });

                newUser.save(function (err, result) {
                    if (err)
                        callback(err);
                    else {
                        callback(null, result);
                    }
                });
            }
            else {
                callback('That email has already been registered', null);
            }

        });
    };

    self.update = function (obj, callback) {

        var User = mongoDb.model('User', userSchema);

        User.findOne({
            email:obj.username
        }, function (err, result) {

            // user doesn't exist
            if (!result) {

                callback('User doesn\'t exist', null);
            }
            else {

                var user = new User(
                    {
                        first_name:obj.first_name,
                        last_name:obj.last_name
                    });

                if (obj.passwordUpdating.toLowerCase() === 'true') {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(obj.password, salt);

                    user.salt = salt;
                    user.hash = hash;
                }

                var updateData = user.toObject();
                delete updateData._id;

                User.update({
                    email:obj.username
                }, updateData, {upsert: true}, function (err, result) {
                    if (err)
                        callback(err);
                    else {
                        callback(null, result);
                    }
                });
            }

        });
    };

    self.get = function (email, callback) {

        var User = mongoDb.model('User', userSchema);

        User.findOne({
            email:email
        }, function (err, result) {

            if (!result) {
                return callback('User with that Username/Email does not exist');
            } else {

                return callback(null, result);
            }
        });
    };

    self.authenticate = function (email, password, callback) {

        var User = mongoDb.model('User', userSchema);

        User.findOne({
            email:email
        }, function (err, result) {

            if (result === null) {
                return callback('User with that Username/Email does not exist');
            } else {

                var user = result;

                verifyPassword(password, user.hash, function (err, passwordCorrect) {
                    if (err) {
                        return callback('An error occurred: ' + err);
                    }
                    if (!passwordCorrect) {
                        return callback('Incorrect Username/Password');
                    }
                    return callback(null, user);
                });
            }
        });
    };

    var verifyPassword = function (password, hash, callback) {
        bcrypt.compare(password, hash, callback);
    };

}

module.exports = new User();
