/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 8:00 PM
 */

var io = require('socket.io');
var uuid = require('node-uuid');
var _ = require('underscore');
var gameModel = require('./domain/game');

function Game() {
    "use strict";

    var self = this;

    self.init = function (server) {

        // Express 3 requires a server object
        io = io.listen(server);

        io.sockets.on('connection', function (socket) {

            socket.on('new_game', function (data) {

                if (parseInt(data.players, 10) === 2)
                    twoPlayerGame(socket, data);
                else
                    singlePlayerGame(socket, data);
            });

            // when a client answers a question
            socket.on('answer', function (data) {

                // tell the other player in the room that this player is still playing
                socket.broadcast.to(data.gameRoom).emit('opponent_playing');

                // grab the question the player answered
                gameModel.getQuestion(data.game, data.question, function (question) {

                    var answer = _.find(question.answers, function (answer) {
                        return answer.id === parseInt(data.answer);
                    });

                    // if the answer is correct then send the player point down to the opponent to update the UI
                    if (answer) {
                        var point = 0;

                        if (answer.correct) {
                            point = 1;

                            if (data.gameRoom)
                                socket.broadcast.to(data.gameRoom).emit('opponent_score', {score:point});
                        }

                    }
                    // get the next question
                    gameModel.getQuestions(data.game, function (result) {

                        // if there is another question send it
                        if (result[data.currentQuestion])
                            socket.emit('new_question', {question:result[data.currentQuestion], score:point});
                        else { // else finish the player game and tell the opponent the player has finished
                            socket.emit('finish', {score:point});
                            socket.broadcast.to(data.gameRoom).emit('opponent_finished');
                        }
                    });

                });

            });

            // if the player runs out of time, finish the game
            socket.on('time_up', function (data) {
                socket.emit('finish', {});
                socket.broadcast.to(data.gameRoom).emit('opponent_finished');
            });
        });
    };

    var singlePlayerGame = function (socket, data) {
        var room = uuid.v4();
        socket.join(room);
        socket.set('game', data.game);
        socket.set('duration', data.duration);
        socket.emit('in_room', {gameRoom:room});

        gameModel.getQuestions(data.game, function (result) {
            io.sockets.in(room).emit('start',
                {
                    // send the first random question
                    question:result[Math.floor(Math.random() * result.length) + 1],

                    // and the number of questions
                    questionCount:result.length
                });
        });

    };

    var twoPlayerGame = function (socket, data) {
        // look through all the rooms to find one with only one player
        var inRoom = false;
        var rooms = io.sockets.manager.rooms;

        for (var room in rooms) {
            var clients = rooms[room];

            // If the room has one player in it and it is not the default room
            if (room !== '' && clients.length === 1) {

                var clientSocketId = clients[0];

                // go through all the clients
                _.each(io.sockets.clients(), function (clientSocket) {

                    if (clientSocket.id === clientSocketId) {

                        // get the game data on the client already in the room for comparison with the newly joining client
                        clientSocket.get('game', function (err, game) {

                            // get the duration data of the client already in the room
                            clientSocket.get('duration', function (derr, duration) {

                                // Game and Duration must be the same so players are playing same game and duration
                                if (parseInt(game) === parseInt(data.game) && parseInt(duration) === parseInt(data.duration)) {

                                    // Join the client to the room with a waiting client playing the same game and duration
                                    socket.join(room.slice(1));
                                    socket.set('game', data.game);
                                    socket.set('duration', data.duration);
                                    socket.emit('in_room', {gameRoom:room.slice(1)});
                                    inRoom = true;

                                    //var clientSocketId = clients[0];
                                    socket.set('playerName', data.playerName);

                                    // go through all the clients
                                    _.each(io.sockets.clients(), function (clientSocket) {

                                        if (clientSocket.id === socket.id) {
                                            // clientSocket.get('playerName', function (err, playerName) {
                                            socket.broadcast.emit('opponent_name', {name:data.playerName});
                                            //});
                                        }
                                        else {
                                            clientSocket.get('playerName', function (err, playerName) {
                                                clientSocket.broadcast.emit('opponent_name', {name:playerName});
                                            });
                                        }
                                    });

                                    gameModel.getQuestions(data.game, function (result) {
                                        io.sockets.in(room.slice(1)).emit('start',
                                            {
                                                // send the first random question
                                                question:result[Math.floor(Math.random() * result.length) + 1],

                                                // and the number of questions
                                                questionCount:result.length,
                                            });
                                    });

                                }
                            });
                        });
                    }
                });

            }

        }

        // There are no rooms to join the create a new room for the client
        if (!inRoom) {
            var room = uuid.v4();
            socket.join(room);
            socket.set('game', data.game);
            socket.set('duration', data.duration);
            socket.emit('in_room', {gameRoom:room});
            socket.set('playerName', data.playerName);

        }
    };

}

module.exports = new Game();