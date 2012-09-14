/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 11:30 AM
 */

$(function () {

    my.RegisterViewModel = function() {

        var self = this;

        self.isBusy = ko.observable(false);

        self.firstName = ko.observable().extend({ required:true });
        self.lastName = ko.observable().extend({ required:true });
        self.username = ko.observable().extend({ required:true , email:true });
        self.password = ko.observable().extend({ minLength:6 , required:true });
        self.confirmPassword = ko.observable().extend({ required:true , equal:{params:self.password, message:'Confirm password must match Password'} });
        self.errorMessage = ko.observable();

        self.isValid = ko.computed(function () {
            var valid = true;

            if (!self.firstName.isValid())
                valid = false;
            if (!self.lastName.isValid())
                valid = false;
            if (!self.username.isValid())
                valid = false;
            if (!self.password.isValid())
                valid = false;
            if (!self.confirmPassword.isValid())
                valid = false;

            if (!valid)
                self.errorMessage('Ensure that all required fields are entered and correct');
            else
                self.errorMessage(null);

            return valid;
        });

        self.register = function () {

            self.isBusy(true);
            self.errorMessage(null);

            var dto = {
                first_name:self.firstName(),
                last_name:self.lastName(),
                email:self.username(),
                password:self.password(),
                confirm:self.confirmPassword()
            };

            $.post('/register', dto, function (err) {

                if (err.err) {
                    self.isBusy(false);
                    self.errorMessage(err.err);
                }
                else {
                    location.href = '/registered';
                }
            });

        };

    }

});