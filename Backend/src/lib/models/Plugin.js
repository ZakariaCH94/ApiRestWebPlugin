const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const pluginSchema = mongoose.Schema({
    nom:{type:String,required:true},
    categorie:{type:String, required:true},
    vendeur:{type:String},
    homePage:{type:String},
    opensSource:{type:Boolean,required:true},
    description:{type:String,required:true},
    image:{type:String,required:false},
    pluginZip:{type:String,required:true},
    id_user:{type:String,required:true},
    commentaires:[{id_user: {type:String},commentaire:{type:String},date:{type:Date}}],
    votes:[{id_user: {type:String},note:{type:Number}}]
});

pluginSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Plugin', pluginSchema);
