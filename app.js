#!/usr/bin/env node

// DEPENDENCIES
const express = require('express');
const exphbs  = require('express-handlebars');
const http    = require('http');
const giphy   = require('giphy-api')()
const path    = require('path')

require('dotenv').config()

// MIDDLEWARE
const app = express();
app.use(express.static('public'));

app.engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    partialsDir: path.join(__dirname, '/views/partials/'),
    defaultLayout: 'main'
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

// ROUTES
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

// LISTENER - only if directly run
if (require.main === module) {
    let port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
}

module.exports = app;
