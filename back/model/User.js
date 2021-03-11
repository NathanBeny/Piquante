// installerons un package de validation pour pré-valider les informations avant de les enregistrer :
// npm install --save mongoose-unique-validator
// Ce package une fois installé, nous pouvons créer notre propre modèle utilisateur :

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Model des users Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail.
const userSchema = mongoose.Schema({
  //L'email doit être unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

//Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
