/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 8:23 PM
 */

var fs = require('fs');
var _ = require('underscore');

function ProcessRoutes() {

    var self = this;

    // app.get('/api/process'
    self.process = function (req, res) {

        var gameId = 0;

        fs.readdir('./json/oldfiles', function (err, results) {

            _.each(results, function (item) {

                gameId++;

                fs.readFile('./json/oldfiles/' + item, function (err, data) {
                    if (err) {
                        console.error("Could not open file: %s", err);
                    }

                    var json = JSON.parse(data.toString());

                    // console.log(JSON.stringify(json));

                    var gameData = {gameId:gameId, gameQuestions:[]};

                    var headerQuestion = json.head.question;

                    var answerArray = [];

                    var questionId = 0;
                    _.each(json.results.bindings, function (obj) {

                        questionId++;
                        var question = headerQuestion.replace('{0}', obj.label.value);
                        var answer = obj.label2.value;

                        answerArray.push(answer);

                        gameData.gameQuestions.push({id:questionId, question:question, answers:[
                            {answer:answer}
                        ]});

                    });

                    _.each(gameData.gameQuestions, function(gameQuestion){
                        var randomItems = _.shuffle(answerArray).slice(0, 4);

                        var filtered = _.filter(randomItems, function(item){
                            return item !== gameQuestion.answers[0].answer;
                        });

                        var tmpArray = [];

                        filtered = filtered.slice(0, 3);

                        _.each(filtered, function(filteredItem){
                            tmpArray.push({answer: filteredItem});
                        });

                        tmpArray.push({answer: gameQuestion.answers[0].answer, correct: true});

                        gameQuestion.answers = [];

                        var i = 0;
                        _.each(_.shuffle(tmpArray), function(answer){
                            i++;
                            answer.id = i;
                            gameQuestion.answers.push(answer);
                        });
                    });


                    fs.writeFile("./json/newfiles/" + item, JSON.stringify(gameData), function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                        }
                    });

                });

            });
        });

        res.json({result:'result'});

    };

}

module.exports = new ProcessRoutes();