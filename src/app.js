const express = require('express');
const server = express();

const hostname = '0.0.0.0';
const port = 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo/apinodeipssi');

// Views and Template engine for the front
const path = require('path');
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use(express.static(path.join(__dirname, 'public')));

const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors());

// Routes for views
server.get('/', (req, res) => {
	res.render('index');
});

server.get('/post/new', (req, res) => {
	res.render('new');
});

server.get('/login', (req, res) => {
	res.render('login');
});
server.get('/register', (req, res) => {
	res.render('register');
});

const postRoute = require('./api/routes/postRoute');
postRoute(server);

const commentRoute = require('./api/routes/commentRoute');
commentRoute(server);

const userRoute = require('./api/routes/userRoute');
userRoute(server);

server.listen(port, hostname);
