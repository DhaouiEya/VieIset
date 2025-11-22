const mongoose = require('mongoose');
const club=new mongoose.Schema({
    nom:{type:String,required:true},
    activites: [{ type: String ,required:true}],
    description:{type:String,required:true},
    imageProfil:{type:String,required:true},
    imageFond:{type:String,required:true},
    dateCreation:{type:Date,required:true},
    departement: { type: String, required: false }, 
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    reseaux: {
      facebook: { type: String },
      instagram: { type: String }
    },

     leaders: [{
        name: { type: String, required: true },
        photoUrl: { type: String, required: true },
        role: { type: String, required: true }
    }],
    
   manager: { 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
        required: true
    },
    membres: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    
    actif:{type:Boolean,default:true}
},{timestamps:true});

module.exports=mongoose.model('Club',club);