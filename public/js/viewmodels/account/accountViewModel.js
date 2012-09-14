/**
 * User: gamaroff
 * Date: 2012/08/16
 * Time: 11:30 AM
 */

$(function () {

    my.AccountViewModel = function (firstName, lastName, username) {

        var self = this;

        self.isBusy = ko.observable(false);

        self.username = ko.observable(username);
        self.firstName = ko.observable(firstName).extend({ required:true });
        self.lastName = ko.observable(lastName).extend({ required:true });
        self.password = ko.observable().extend({ minLength:6 });
        self.confirmPassword = ko.observable().extend({ equal:{params:self.password, message:'Confirm password must match Password'} });
        self.errorMessage = ko.observable();
        self.canUpdatePassword = ko.observable(false);

        self.isValid = ko.computed(function () {
            var valid = true;

            if (!self.firstName.isValid())
                valid = false;
            if (!self.lastName.isValid())
                valid = false;

            if (self.canUpdatePassword()) {
                if (!self.password.isValid())
                    valid = false;
                if (!self.confirmPassword.isValid())
                    valid = false;
            }

            if (!valid)
                self.errorMessage('Ensure that all required fields are entered and correct');
            else
                self.errorMessage(null);

            return valid;
        });

        self.update = function () {

            self.isBusy(true);
            self.errorMessage(null);

            var dto = {
                first_name:self.firstName(),
                last_name:self.lastName(),
                username:self.username(),
                passwordUpdating:self.canUpdatePassword(),
                password:self.password(),
                confirm:self.confirmPassword()
            };

            $.post('/account', dto, function (err) {
                self.isBusy(false);

                if (err.err) {
                    self.errorMessage(err.err);
                }
                else
                    alert('Details Updated');
            });

        };

        self.passwordUpdate = function () {
            self.canUpdatePassword(!self.canUpdatePassword());

            if (self.canUpdatePassword()) {
                self.password.extend({ required:true });
                self.confirmPassword.extend({ required:true });
            }
            else {
                self.password.extend({ required:false });
                self.confirmPassword.extend({ required:false });

                var tempName = self.firstName();
                self.firstName('');
                self.firstName(tempName);
            }
        };

    }

});