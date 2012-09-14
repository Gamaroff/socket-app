/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 9:11 PM
 */
$(function () {

    my.AnswerModel = function () {

        var self = this;

        self.id = ko.observable();
        self.answer = ko.observable();
        self.correct = ko.observable();

    }
});