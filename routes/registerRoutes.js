var User = require('../domain/user');

function RegisterRoutes() {

    var self = this;

    self.view = function (req, res) {
        if (req.user)
            res.redirect('/account');

        res.render('account/register.jade', {
            title:'Register a new user',
            currentUser:req.user
        });
    };

    self.viewRegistered = function (req, res) {
        if (req.user)
            res.redirect('/account');

        res.render('account/registered.jade', {
            title:'Registered',
            currentUser:req.user
        });
    };

    // app.post('/register'...)
    self.save = function (req, res) {
        User.save({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            password:req.body.password
        }, function (err, result) {
            res.send({err:err, result:result});
        });
    };

}

module.exports = new RegisterRoutes();
