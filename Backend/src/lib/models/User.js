const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = mongoose.Schema({
    nom:{type:String,required:true},
    prenom:{type:String, required:true},
    username:{type:String,required:true},
    motdepasse:{type:String,required:true}
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
