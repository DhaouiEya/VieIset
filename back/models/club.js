const mongoose = require('mongoose');
const Etudiant = require("../models/etudiant");
const club=new mongoose.Schema({
    nom:{type:String,required:true},
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
   manager: { 
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Etudiant',
        required: true
    },
    membres: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Etudiant'
    }]
},{timestamps:true});

module.exports=mongoose.model('Club',club);