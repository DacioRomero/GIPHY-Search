// DECLARATIONS
var express = require('express');
var exphbs  = require('express-handlebars');
var http    = require('http');
var giphy   = require('giphy-api')()
var path    = require('path')
var app     = express();

// MIDDLEWARE
app.use(express.static('public'));

app.engine('handlebars', exphbs({
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    defaultLayout: 'main'
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

// ROUTES
// app.get('/hello-world', function (req, res) {
//     res.send('Hello World');
// });

// app.get('/hello-squirrel', function (req, res) {
//     res.send('Hello Squirrel');
// });

app.get('/', function (req, res) {
    if(req.query.term) {
        giphy.search(req.query.term || "cat", function (err, response) {
            res.render('home', { gifs: response.data, searchTerm: req.query.term })
        });
    }
    else {
        giphy.trending(function (err, response) {
            res.render('home', { gifs: response.data, searchTerm: "Trending" })
        });
    }
});

// app.get('/hello-gif', function (req, res) {
//     var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
//     res.render('hello-gif', {gifUrl: gifUrl})
// })

// app.get('/greetings/:name', function (req, res) {
//     var name = req.params.name;
//     res.render('greetings', {name: name});
// })

if (require.main === module) {
    let port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log('App listening on port ' + port + '!');
    });
}

module.exports = app;
