/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 9:11 PM
 */
$(function () {

    my.QuestionModel = function () {

        var self = this;

        self.id = ko.observable();
        self.question = ko.observable();
        self.gameId = ko.observable();
        self.answers = ko.observableArray();

    }
});