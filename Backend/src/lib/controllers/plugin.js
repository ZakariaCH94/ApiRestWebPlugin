const mongoose = require('mongoose');
const Plugin = require('../models/plugin');
const jwt = require("jsonwebtoken");
//const multer = require("multer");
const bcrypt =  require("bcrypt");
//const express = require("express");
var unzipper = require('unzipper');
const fs = require('fs');

//const app=express();

//app.use('/uploads', express.static('../../uploads'));
//app.use('/uploadzip', express.static('../../uploads/zipupload'));

/*
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toDateString()+new Date().getMilliseconds()+file.originalname);
    }
});

const upload = multer({storage:storage});
*/


createPlugin =(req, resp) => {
    jwt.verify(req.token,'RANDOM_TOKEN_SECRET',(err,data)=> {
        if (err) {
            resp.sendStatus(403)
        } else {
            const pathZip = 'uploads/zipupload/'+(req.files["pluginZip"][0].path).substring(12, (req.files["pluginZip"][0].path).length - 4)
            fs.createReadStream(req.files["pluginZip"][0].path)
                .pipe(unzipper.Extract({ path: pathZip }));
            let plugin = new Plugin(
                {
                    _id: new mongoose.Types.ObjectId(),
                    "nom":req.body.nom,
                    "categorie":req.body.categorie,
                    "vendeur":req.body.vendeur,
                    "homePage":req.body.homePage,
                    "opensSource":req.body.opensSource,
                    "description":req.body.description,
                    "image":req.files["image"][0].path,
                    "pluginZip":pathZip+'/index.html',
                    "id_user":req.body.id_user
                }
            )
            console.log("aaaaaaaaaaaa");
            plugin.save()
                .then(plugin => {
                    console.log(plugin);
                    resp.status(200).json({message: "Plugin successfully created"});
                })
                .catch(err => {
                    console.log(err);
                    resp.status(500).json({error: err});
                });
        }
    })
};

getAllPluginsPagination =(req, resp) => {
    let p=parseInt(req.query.page || 1);
    let size=parseInt(req.query.size || 2);
    jwt.verify(req.token,'RANDOM_TOKEN_SECRET',(err,data)=> {
        if (err) {
            resp.sendStatus(403)
        } else {
            Plugin.paginate({},{page:p,limit:size})
                .then(plugins=>{
                    let pluginsData=[]
                    plugins.docs.forEach(plugin =>{
                        let data=fs.readFileSync(plugin.image)
                        pluginsData.push({plugin:plugin,data:data,total: plugins.total})
                    });
                    resp.send(pluginsData)
                })
                .catch(err=>resp.status(500).send(err));
        }
    })
};

getPluginsById =(req, resp) => {
    jwt.verify(req.token,'RANDOM_TOKEN_SECRET',(err,data)=> {
        if (err) {
            resp.sendStatus(403)
        } else {
            var somme =0;
            Plugin.findById(req.params.id)
                .then(plugin=>{
                    plugin.votes.forEach(vote=>
                    {somme =somme+vote.note;
                    });
                    const moyenne=parseInt(somme/plugin.votes.length);

                    let data=fs.readFileSync(plugin.image);
                    resp.send({plugin:plugin,data:data,moyenne:moyenne})
                })
                .catch(err=>resp.status(500).send(err))
        }
    })
};

getPluginsByUserPagination = (req, resp) => {

    let p=parseInt(req.query.page || 1);
    let size=parseInt(req.query.size || 7);
    jwt.verify(req.token,'RANDOM_TOKEN_SECRET',(err,data)=> {
        if (err) {
            resp.sendStatus(403)
        } else {
            Plugin.paginate({id_user:req.params.username},{page:p,limit:size})
                .then(plugins=>{
                    resp.send(plugins);
                })
                .catch(err=>resp.status(500).send(err))
        }
    })
};

updatePlugin =(req, resp) => {

    jwt.verify(req.token,'RANDOM_TOKEN_SECRET',(err,data)=> {
        if (err) {
            resp.sendStatus(403)
        } else {
            Plugin.findByIdAndUpdate((req.params.id),req.body)
                .then(plugin=>{
                    resp.send(plugin);
                })
                .catch(err=>resp.status(500).send(err))
        }
    })
};

getPluginsByCategoryPagination =(req, resp) => {

    let p=parseInt(req.query.page || 1);
    let size=parseInt(req.query.size || 2);
    jwt.verify(req.token,'RANDOM_TOKEN_SECRET',(err,data)=> {
        if (err) {
            resp.sendStatus(403)
        } else {
            Plugin.paginate({categorie:req.query.cat},{page:p,limit:size})
                .then(plugins=>{
                    resp.send(plugins);
                })
                .catch(err=>resp.status(500).send(err))
        }
    })
};

/*
function verifieToken(req,resp,next) {
    const beararHeader=req.headers["authorization"];
    if (typeof beararHeader !== 'undefined') {
        const baerar=beararHeader.split(" ");
        const beararToken=baerar[1];
        req.token=beararToken;
        next();
    }
    else {
        resp.json({message: "you are not authorized to make this request"});
    }
}

*/

module.exports = {
    createPlugin,
    getAllPluginsPagination,
    getPluginsById,
    getPluginsByUserPagination,
    updatePlugin,
    getPluginsByCategoryPagination
};
