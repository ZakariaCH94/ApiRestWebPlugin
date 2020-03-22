const mongoose = require('mongoose');
const User = require('../models/user');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt =  require("bcrypt");
const express = require("express");


const app=express();

login= (req, resp) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return resp.status(401).json({ error: 'incorrect username!' });
            }
            bcrypt.compare(req.body.motdepasse, user.motdepasse)
                .then(valid => {
                    if (!valid) {
                        console.log("if statment valid")
                        return resp.status(401).json({ error: 'incorrect password !' });
                    }
                    const token = jwt.sign(
                        { username: user.username},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '1h' });
                    resp.json({
                        username: user.username,
                        message:"access",
                        token: token
                    });
                })
                .catch(error => resp.status(500).json({ error: 'catch bcrypt' }));
        })
        .catch(error => resp.status(500).json({ error: 'catch find' }));
};

signup =(req, resp) => {
    let username = req.body.username;
    User.findOne({username: username})
        .then(user=> {
            if (user) {
                resp.json({message: "username already exists"});
            } else {
                bcrypt.hash(req.body.motdepasse, 10, (err, hash) => {
                    let user = new User({
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        username: req.body.username,
                        motdepasse: hash
                    });
                    user.save()
                        .then (()=>{
                            resp.status(200).json({message: "Account successfully created"});

                        })
                        .catch(error => resp.status(500).json({ error: 'catch save' }));
                })
            }
        })
        .catch(error => resp.status(500).json({ error: 'catch find' }));
};

hello=(req,resp)=>{
    resp.send("Hello Express")
};

module.exports = {
    login,
    signup,
    hello
};

