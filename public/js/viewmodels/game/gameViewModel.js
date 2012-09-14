/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 8:18 PM
 */
$(function () {

    my.GameViewModel = function (playerFirstName, playerLastName) {

        var self = this;

        var currentQuestion = 0;
        var questionCount = 0;
        var questionList = [];

        var socket;
        var gameCountdown = new my.CountDownTimer();

        self.isBusy = ko.observable(false);
        self.games = ko.observableArray();
        self.durations = ko.observableArray([
            {value:1, name:'1 minute'},
            {value:2, name:'2 minutes'},
            {value:5, name:'5 minutes'},
            {value:10, name:'10 minutes'}
        ]);

        self.selectedDuration = ko.observable();
        self.selectedPlayers = ko.observable(0);
        self.selectedGame = ko.observable();
        self.questions = ko.observableArray();

        self.question = ko.observable();
        self.answers = ko.observableArray();
        self.score = ko.observable(0);

        self.opponentScore = ko.observable(0);
        self.opponentStatus = ko.observable(false);
        self.opponentName = ko.observable('Opponent');
        self.playerName = ko.observable(playerFirstName + ' ' + playerLastName);
        self.gameRoom = ko.observable();

        self.finished = ko.observable(false);

        self.gameActive = ko.observable(false);

        self.message = ko.observable();

        self.selectSingle = function () {
            self.selectedPlayers(1);
        };

        self.selectMulti = function () {
            self.selectedPlayers(2);
        };

        self.loadGames = function () {

            self.isBusy(true);

            $.get('/api/games', function (data) {
                self.isBusy(false);

                $.each(data.result, function (index, item) {

                    var model = new my.GameModel();
                    model.id(item.id);
                    model.name(item.name);

                    self.games.push(model)
                });

            });

        };

        self.startGame = function () {

            // create a connection to the game
            socket = io.connect('http://localhost:3000');

            self.gameActive(true);

            // tell the socket that the player has created a game and is now waiting
            socket.emit('new_game', {
                game:self.selectedGame().id(),
                duration:self.selectedDuration(),
                playerName:self.playerName(),
                players:self.selectedPlayers()
            });

            if (self.selectedPlayers() > 1)
                self.message('Waiting for another player...');

            // when a player joins a room grab the room name
            socket.on('in_room', function (data) {
                self.gameRoom(data.gameRoom);
            });

            // when the game starts
            socket.on('start', function (data) {

                if (self.selectedPlayers() > 1)
                    self.message(self.opponentName() + ' has joined the game. Starting game in...');
                else
                    self.message('Starting game in...');

                $('#GameStartCountdown').show();

                var startCountdown = new my.CountDownTimer();

                startCountdown.init(5, 'GameStartCountdown', function () {

                    $('#GameStartCountdown').hide();
                    self.message('Your game has started!');

                    // set the duration and countdown timer
                    var gameDuration = parseInt(self.selectedDuration()) * 60;

                    gameCountdown.init(gameDuration, 'GameCountdown', function () {
                        socket.emit('time_up', {gameRoom:self.gameRoom()});
                    });

                    // set the questionCount
                    questionCount = data.questionCount;

                    for (var i = 0; i < questionCount; i++)
                        questionList.push(i);

                    questionList = _.shuffle(questionList);

                    // fetch a question
                    loadQuestion(data.question);
                });

            });

            // when a new question arrives update the score if the player was correct
            socket.on('new_question', function (data) {
                self.score(self.score() + data.score);
                loadQuestion(data.question);
            });

            // when the game is finished update the score end the game
            socket.on('finish', function (data) {
                if (data.score)
                    self.score(self.score() + data.score);
                gameCountdown.stop();
                self.message('Your game has finished.');
                self.question(null);
                self.finished(true);

            });

            // when an opponent scores a point update the opponent score
            socket.on('opponent_score', function (data) {
                self.opponentScore(self.opponentScore() + data.score);
            });

            // when an opponent starts
            socket.on('opponent_name', function (data) {
                self.opponentName(data.name);
            });

            // when the opponent finishes the game notify the ui
            socket.on('opponent_finished', function (data) {
                self.opponentStatus(false);
            });

            // while the opponent is playing alert the ui
            socket.on('opponent_playing', function (data) {
                self.opponentStatus(true);
            });
        };

        // when a player selects and answer then send it to the socket
        self.selectAnswer = function (answer) {
            socket.emit('answer', {
                game:self.selectedGame().id(),
                question:self.question().id(),
                answer:answer.id(),
                currentQuestion:questionList[currentQuestion],
                gameRoom:self.gameRoom()
            });
        };

        self.submitScore = function () {
            self.isBusy(true);

            var dto = {
                game_id:self.selectedGame().id(),
                game_description:self.selectedGame().name(),
                duration:self.selectedDuration(),
                score:self.score(),
                players:self.selectedPlayers()
            };

            $.post('/api/leaderboard', dto, function (data) {

                self.isBusy(false);

                if (data.err)
                    alert(data.err);
                else {
                    location.href = '/leaderboard';
                    // alert('Submitted. You can see your score in the leaderboard');
                }
            });
        };

        self.loadGames();

        // load a question into the view model for the ui to bind to
        var loadQuestion = function (question) {
            currentQuestion++;

            var questionModel = new my.QuestionModel();
            questionModel.id(question.id);
            questionModel.question(question.question);
            questionModel.gameId(question.gameId);

            self.question(questionModel);

            self.answers.removeAll();

            $.each(question.answers, function (index, answer) {
                var answerModel = new my.AnswerModel();
                answerModel.id(answer.id);
                answerModel.answer(answer.answer);
                answerModel.correct(answer.correct);
                self.answers.push(answerModel);
            });
        }

    };

});