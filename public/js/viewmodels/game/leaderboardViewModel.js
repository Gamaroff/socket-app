/**
 * User: gamaroff
 * Date: 2012/08/24
 * Time: 4:07 PM
 */

$(function () {

    my.LeaderBoardViewModel = function () {

        var self = this;

        self.games = ko.observableArray();

        self.leaderboard = ko.observableArray();
        self.durations = ko.observableArray([
            {value:1, name:'1 minute'},
            {value:2, name:'2 minutes'},
            {value:5, name:'5 minutes'},
            {value:10, name:'10 minutes'}
        ]);
        self.players = ko.observableArray([
            {id:1, name:'1 Player'},
            {id:2, name:'2 Player'}
        ]);

        self.selectedPlayers = ko.observable(0);
        self.selectedDuration = ko.observable();
        self.selectedGame = ko.observable();

        self.isBusy = ko.observable(false);

        self.loadLeaderBoard = function () {

            self.leaderboard.removeAll();

            self.isBusy(true);

                $.get('/api/leaderboard/' + self.selectedGame().id() +'/' + self.selectedDuration() +'/' + self.selectedPlayers(), function (data) {
                    self.isBusy(false);

                    $.each(data.result, function (index, item) {

                        var model = new my.LeaderBoardModel();
                        model.player(item.player);
                        model.duration(item.duration);
                        model.gameId(item.game_id);
                        model.gameDescription(item.game_description);
                        model.score(item.score);
                        model.date(new moment(item.date).format('YYYY-MM-DDTHH:mm:ss'));

                        self.leaderboard.push(model)
                    });
                });

        };

        var loadGames = function () {

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
        loadGames();

    };

});