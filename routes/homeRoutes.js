function HomeRoutes() {

    var self = this;

    // app.get('/'...)
    self.viewIndex = function (req, res) {
        res.render('index.jade', {
            title:'Socket Game',
            currentUser:req.user
        });
    };
}

module.exports = new HomeRoutes();