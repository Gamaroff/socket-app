/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 10:55 AM
 */
$(function () {

    my.LoginViewModel = function () {

        var self = this;

        self.isBusy = ko.observable(false);

        self.username = ko.observable().extend({ required:true }).extend({ email:true });
        self.password = ko.observable().extend({ minLength:6 }).extend({ required:true });
        self.remember = ko.observable();
        self.errorMessage = ko.observable();

        self.isValid = ko.computed(function () {
            var valid = true;

            if (!self.username.isValid())
                valid = false;
            if (!self.password.isValid())
                valid = false;

            return valid;
        });

        self.login = function () {

            self.isBusy(true);
            self.errorMessage(null);

            var dto = {
                username:self.username(),
                password:self.password()
            };

            $.post('/login', dto, function (err) {
                if (err.err) {
                    self.isBusy(false);
                    self.errorMessage(err.err);
                }
                else {
                    location.href = '/game';
                }
            });

        };

    };

});