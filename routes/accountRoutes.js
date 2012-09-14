var userModel = require('../domain/user')

function AccountRoutes() {

    var self = this;

    // app.get('/account' ...
    self.view = function (req, res) {
        res.render('account/account.jade',
            {
                title:'Your Account',
                currentUser:req.user
            }
        );
    };

    // app.get('/login', ..
    self.viewLogin = function (req, res) {
        res.render('account/login.jade', {
            user:req.user,
            title:'Login',
            currentUser:req.user
        });
    };

    self.update = function (req, res) {

        userModel.update(req.body, function(err, result){
            if (err) {
                res.send({err:err});
            }
            else {
                res.send({err:null, result:result});
            }
        });

    };

    self.login = function (req, res) {
            res.send({result:true});
    };

    // app.get('/logout'...)
    self.logout = function (req, res) {
        req.logout();
        res.redirect('/');
    };

}

module.exports = new AccountRoutes();
