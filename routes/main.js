var app = module.parent.exports.app
  , config = module.parent.exports.config
  , moment = require('moment');

app.get('/', function(req, res){
    res.render('index', { title: 'RPG Builder', section: 'Welcome', user: req.user});
});

// Admin Panel URLs
app.get('/admin', function(req, res){
    res.render('admin/index', { title: 'Admin Panel', section: 'Admin Panel' });
});

app.get('/panel', function(req, res){
    res.render('admin/panel', { title: 'Admin Panel', section: 'Admin Panel' });
});
