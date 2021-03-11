const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// ccéder au path de notre serveur :
const path = require('path')

//Création appli Express
const app = express()

//  enregistrement notre nouveau routeur dans notre fichier app.js
const userRoutes = require('./route/user')
const sauceRoutes = require('./route/sauce')

// connection a la Base de donnée mango

mongoose
  .connect(
    'mongodb+srv://Aly:Aly34@cluster0.at9uz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

// **************************************Sécurité empeche requetes malveillante

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

//************************************* */
//  Rend requete exploitable
app.use(bodyParser.json())
// gestionnaire de routage suivant juste au-dessus de nos routes actuelles :
app.use('/images', express.static(path.join(__dirname, 'images')))

// Nous enregistrerons ensuite comme nous le ferions pour une route unique. Nous voulons enregistrer notre routeur pour toutes les demandes effectuées vers
app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)

module.exports = app
