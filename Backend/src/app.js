const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('../uploads'));
app.use('/uploadzip', express.static('../uploads/zipupload'));

const userRoutes = require('./lib/routes/user');
const pluginsRoutes = require('./lib/routes/plugin');

mongoose.connect('mongodb://localhost:27017/WebAudio')
    .then(() => console.log('Connection to MongoDB successful !'))
    .catch(() => console.log('Connection to MongoDB failed !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(bodyParser.json());

app.use('/auth', userRoutes);
app.use('/plugins', pluginsRoutes);
module.exports = app;
